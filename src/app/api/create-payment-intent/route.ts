// src/app/api/create-payment-intent/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createTransaction } from '../payment/route';

// Add console.log to debug
console.log('ENV:', {
  hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
  keyPrefix: process.env.STRIPE_SECRET_KEY?.slice(0, 7)
});

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { amount, currency, userId, trainingId, couponId } = await request.json();

    if (!amount || !currency || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Create transaction record
    const transactionId = await createTransaction({
      user_id: userId,
      training_id: trainingId,
      amount: amount / 100, // Convert from cents to actual amount
      payment_method: 'stripe',
      transaction_reference: `stripe_${Date.now()}`,
      coupon_id: couponId,
    });

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ['card'],
      metadata: {
        transactionId,
        userId,
        trainingId,
      },
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      transactionId,
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}