import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { calculateCommission, COMMISSION_RATES } from '@/services/commissionService';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as { userId: number };
    const pool = initDB();

    try {
      // Vérifier si les tables existent
      const [tables] = await pool.query(`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME IN ('training_purchases', 'commissions', 'commission_payments')
      `);

      // Si les tables n'existent pas encore, retourner des données vides
      if ((tables as any[]).length < 3) {
        return NextResponse.json({
          commissions: [],
          summary: {
            totalCommissions: 0,
            totalTVA: 0,
            totalRetenue: 0,
            netAmount: 0,
            totalCaritative: 0,
            byGeneration: {}
          }
        });
      }

      // Si les tables existent, procéder à la requête normale
      const [commissions] = await pool.query(`
        SELECT 
          c.id,
          c.amount as baseAmount,
          c.generation,
          c.created_at as date,
          u.username as fromUser,
          t.title as trainingName
        FROM commissions c
        JOIN users u ON c.from_user_id = u.id
        JOIN trainings t ON c.training_id = t.id
        WHERE c.user_id = ? AND c.status = 'completed'
        ORDER BY c.created_at DESC
      `, [decoded.userId]);

      // Process commissions
      const processedCommissions = (commissions as any[]).map(comm => {
        const calculated = calculateCommission(comm.baseAmount, comm.generation);
        return {
          ...comm,
          ...calculated
        };
      });

      // Calculate summary
      const summary = processedCommissions.reduce((acc: any, curr) => {
        if (!acc.byGeneration[curr.generation]) {
          acc.byGeneration[curr.generation] = {
            count: 0,
            total: 0,
            rate: COMMISSION_RATES[curr.generation as keyof typeof COMMISSION_RATES] * 100,
            isCaritative: curr.generation === 6
          };
        }

        acc.byGeneration[curr.generation].count++;
        acc.byGeneration[curr.generation].total += curr.finalAmount;
        
        if (!curr.isCaritative) {
          acc.totalCommissions += curr.amount;
          acc.totalTVA += curr.tva;
          acc.totalRetenue += curr.retenueSurce;
          acc.netAmount += curr.finalAmount;
        } else {
          acc.totalCaritative += curr.finalAmount;
        }

        return acc;
      }, {
        totalCommissions: 0,
        totalTVA: 0,
        totalRetenue: 0,
        netAmount: 0,
        totalCaritative: 0,
        byGeneration: {}
      });

      return NextResponse.json({
        commissions: processedCommissions,
        summary
      });

    } catch (err: any) {
      // En cas d'erreur de table manquante, retourner des données vides
      console.error('Database error:', err);
      return NextResponse.json({
        commissions: [],
        summary: {
          totalCommissions: 0,
          totalTVA: 0,
          totalRetenue: 0,
          netAmount: 0,
          totalCaritative: 0,
          byGeneration: {}
        }
      });
    }

  } catch (error) {
    console.error('Commissions error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 