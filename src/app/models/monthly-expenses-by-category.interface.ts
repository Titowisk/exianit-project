export interface MonthlyExpensesByCategory {
  month: string;

  houseTotal: number;
  foodTotal: number;
  groceriesTotal: number;
  healthTotal: number;
  shopTotal: number;
  leisureTotal: number;
  donationsTotal: number;
  transportTotal: number;
  educationTotal: number;
  taxAndTributesTotal: number;
  investmentsTotal: number;
  vacationTotal: number;

  totalMonth: number;
}

export interface ExpensesSummaryTotals {
  houseTotal: number;
  foodTotal: number;
  groceriesTotal: number;
  healthTotal: number;
  shopTotal: number;
  leisureTotal: number;
  donationsTotal: number;
  transportTotal: number;
  educationTotal: number;
  taxAndTributesTotal: number;
  investmentsTotal: number;
  vacationTotal: number;

  totalMonth: number;
}
