import { IncomesCategory } from '../models/enums/incomes-category.enum';
import { IncomesAnalytics } from '../models/incomes-analytics.interface';

export const INCOMES_COLORS_DICT: Record<IncomesCategory, IncomesAnalytics> = {
  [IncomesCategory.Salary]: {
    category: IncomesCategory.Salary,
    label: 'Salary',
    color: '#34a853'
  },
  [IncomesCategory.Benefits]: {
    category: IncomesCategory.Benefits,
    label: 'Benefits',
    color: '#2d8e47'
  },
  [IncomesCategory.TaxReturns]: {
    category: IncomesCategory.TaxReturns,
    label: 'Tax Returns',
    color: '#26743b'
  },
  [IncomesCategory.Bonus]: {
    category: IncomesCategory.Bonus,
    label: 'Bonus',
    color: '#1f5a2f'
  },
  [IncomesCategory.PaidVacation]: {
    category: IncomesCategory.PaidVacation,
    label: 'Paid Vacation',
    color: '#184023'
  },
  [IncomesCategory.Others]: {
    category: IncomesCategory.Others,
    label: 'Others',
    color: '#112617'
  }
};
