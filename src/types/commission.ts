export interface Commission {
  id: number;
  trainingName: string;
  fromUser: string;
  generation: number;
  date: string;
  baseAmount: number;
  rate: number;
  amount: number;
  tva: number;
  retenueSurce: number;
  finalAmount: number;
  isCaritative: boolean;
  status: 'pending' | 'paid' | 'failed';
  payment_date?: string;
}

export interface CommissionSummary {
  totalCommissions: number;
  totalTVA: number;
  totalRetenue: number;
  netAmount: number;
  totalCaritative: number;
  totalPending: number;
  totalPaid: number;
  byGeneration: {
    [key: number]: {
      count: number;
      total: number;
      rate: number;
      isCaritative: boolean;
      pending: number;
      paid: number;
    }
  };
  byPeriod: {
    [key: string]: {
      total: number;
      pending: number;
      paid: number;
    }
  };
} 