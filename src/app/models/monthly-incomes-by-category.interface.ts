import { Month } from './enums/month.enum';

export interface MonthlyIncomesByCategory {
  month: Month;
  
  salary: number;
  benefits: number;
  taxReturns: number;
  bonus: number;
  paidVacation: number;
  others: number;
}
