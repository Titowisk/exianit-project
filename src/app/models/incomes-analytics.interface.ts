import { IncomesCategory } from './enums/incomes-category.enum';

export interface IncomesAnalytics {
  category: IncomesCategory;
  label: string;
  color: string;
}
