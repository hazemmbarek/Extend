// src/utils/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export async function createTransaction(data: {
  user_id: number;
  training_id?: number;
  amount: number;
  payment_method: string;
  transaction_reference: string;
  coupon_id?: number;
}) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Create transaction
    const [transactionResult] = await connection.execute(
      `INSERT INTO transactions 
       (user_id, training_id, amount, type, payment_method, transaction_reference, coupon_id) 
       VALUES (?, ?, ?, 'payment', ?, ?, ?)`,
      [data.user_id, data.training_id, data.amount, data.payment_method, data.transaction_reference, data.coupon_id]
    );

    const transactionId = (transactionResult as any).insertId;

    // Create payment record
    await connection.execute(
      `INSERT INTO payments (transaction_id, payment_method, payment_details)
       VALUES (?, ?, ?)`,
      [transactionId, data.payment_method, JSON.stringify({})]
    );

    await connection.commit();
    return transactionId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updatePaymentStatus(transactionId: number, status: 'completed' | 'failed', paymentDetails: any) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    // Update transaction status
    await connection.execute(
      `UPDATE transactions 
       SET status = ?, 
           completed_at = ${status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL'}
       WHERE id = ?`,
      [status, transactionId]
    );

    // Update payment status
    await connection.execute(
      `UPDATE payments 
       SET status = ?,
           payment_details = ?,
           completed_at = ${status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL'}
       WHERE transaction_id = ?`,
      [status, JSON.stringify(paymentDetails), transactionId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}