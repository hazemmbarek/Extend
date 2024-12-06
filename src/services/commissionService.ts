export const COMMISSION_RATES = {
  1: 0.20, // 1ère génération : 20%
  2: 0.10, // 2ème génération : 10%
  3: 0.15, // 3ème génération : 15%
  4: 0.03, // 4ème génération : 3%
  5: 0.02, // 5ème génération : 2%
  6: 0.01  // 6ème génération : 1% (caritative)
};

export const TVA_RATE = 0.19; // 19%
export const RETENUE_SOURCE_RATE = 0.10; // 10%

export function calculateCommission(baseAmount: number, generation: number) {
  const rate = COMMISSION_RATES[generation as keyof typeof COMMISSION_RATES] || 0;
  const amount = baseAmount * rate;
  const tva = amount * TVA_RATE;
  const retenueSurce = amount * RETENUE_SOURCE_RATE;
  const finalAmount = amount - tva - retenueSurce;

  return {
    rate,
    amount,
    tva,
    retenueSurce,
    finalAmount,
    isCaritative: generation === 6
  };
} 