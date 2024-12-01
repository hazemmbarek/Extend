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

    // Get all commissions with their generation levels
    const [commissions] = await pool.query(`
      WITH RECURSIVE user_tree AS (
        -- Base case: direct referrals (1st generation)
        SELECT 
          u.id as user_id,
          r.id as referral_id,
          1 as generation
        FROM users u
        JOIN users r ON r.sponsor_id = u.id
        WHERE u.id = ?

        UNION ALL

        -- Recursive case: next generations
        SELECT 
          t.user_id,
          r.id as referral_id,
          t.generation + 1
        FROM user_tree t
        JOIN users r ON r.sponsor_id = t.referral_id
        WHERE t.generation < 6
      )
      SELECT 
        t.generation,
        tr.id as training_id,
        tr.title as training_name,
        tr.price as base_amount,
        u.username as referral_name,
        tp.created_at as transaction_date,
        tp.id as transaction_id
      FROM user_tree t
      JOIN users u ON u.id = t.referral_id
      JOIN training_purchases tp ON tp.user_id = t.referral_id
      JOIN trainings tr ON tr.id = tp.training_id
      WHERE tp.status = 'completed'
      ORDER BY tp.created_at DESC
    `, [decoded.userId]);

    // Process commissions
    const processedCommissions = (commissions as any[]).map(comm => {
      const calculated = calculateCommission(comm.base_amount, comm.generation);
      return {
        id: comm.transaction_id,
        trainingId: comm.training_id,
        trainingName: comm.training_name,
        fromUser: comm.referral_name,
        generation: comm.generation,
        date: comm.transaction_date,
        baseAmount: comm.base_amount,
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

  } catch (error) {
    console.error('Commissions error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 