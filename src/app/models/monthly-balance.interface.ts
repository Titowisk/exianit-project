export interface MonthlyBalance {
  month: string;
  totalMainIncome: number;
  totalCost: number;
  totalMainBalance: number;
  totalOthers: number;
  totalBalance: number;
}

export interface BalanceSummaryTotals {
  totalMainIncome: number;
  totalCost: number;
  totalMainBalance: number;
  totalOthers: number;
  totalBalance: number;
}

export interface BalanceSummaryResponse {
  monthlyBalances: MonthlyBalance[];
  averages: BalanceSummaryTotals;
  totals: BalanceSummaryTotals;
}
