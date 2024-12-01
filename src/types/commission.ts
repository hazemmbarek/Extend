export interface Commission {
  id: number;
  generation: number;
  amount: number;
  baseAmount: number;
  rate: number;
  tva: number;
  retenueSurce: number;
  finalAmount: number;
  date: string;
  fromUser: string;
  trainingName: string;
}

export interface CommissionSummary {
  totalCommissions: number;
  totalTVA: number;
  totalRetenue: number;
  netAmount: number;
  byGeneration: {
    [key: number]: {
      count: number;
      total: number;
      rate: number;
    }
  };
} 