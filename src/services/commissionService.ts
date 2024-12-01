export const COMMISSION_RATES = {
  1: 0.20, // 20%
  2: 0.10, // 10%
  3: 0.15, // 15%
  4: 0.03, // 3%
  5: 0.02, // 2%
  6: 0.01  // 1% (caritative)
};

export const TVA_RATE = 0.19; // 19%
export const RETENUE_SOURCE_RATE = 0.10; // 10%

export function calculateCommission(baseAmount: number, generation: number): {
  amount: number;
  tva: number;
  retenueSurce: number;
  finalAmount: number;
} {
  const rate = COMMISSION_RATES[generation as keyof typeof COMMISSION_RATES] || 0;
  const amount = baseAmount * rate;
  const tva = amount * TVA_RATE;
  const retenueSurce = amount * RETENUE_SOURCE_RATE;
  const finalAmount = amount - tva - retenueSurce;

  return {
    amount,
    tva,
    retenueSurce,
    finalAmount
  };
} 