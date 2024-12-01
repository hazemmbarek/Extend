import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { calculateCommission } from '@/services/commissionService';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as { userId: number };
    const pool = initDB();

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
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [decoded.userId]);

    // Calculer les détails pour chaque commission
    const processedCommissions = (commissions as any[]).map(comm => {
      const calculated = calculateCommission(comm.baseAmount, comm.generation);
      return {
        ...comm,
        ...calculated
      };
    });

    // Calculer les totaux par génération
    const summary = processedCommissions.reduce((acc: CommissionSummary, curr) => {
      if (!acc.byGeneration[curr.generation]) {
        acc.byGeneration[curr.generation] = {
          count: 0,
          total: 0,
          rate: COMMISSION_RATES[curr.generation as keyof typeof COMMISSION_RATES] * 100
        };
      }

      acc.byGeneration[curr.generation].count++;
      acc.byGeneration[curr.generation].total += curr.finalAmount;
      acc.totalCommissions += curr.amount;
      acc.totalTVA += curr.tva;
      acc.totalRetenue += curr.retenueSurce;
      acc.netAmount += curr.finalAmount;

      return acc;
    }, {
      totalCommissions: 0,
      totalTVA: 0,
      totalRetenue: 0,
      netAmount: 0,
      byGeneration: {}
    });

    return NextResponse.json({
      commissions: processedCommissions,
      summary
    });

  } catch (error) {
    console.error('Commissions error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 