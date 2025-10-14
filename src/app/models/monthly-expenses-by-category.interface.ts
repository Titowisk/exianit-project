import { Month } from './month.enum';

export interface MonthlyExpensesByCategory {
  month: Month;

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

  totalMonth: number;
}
