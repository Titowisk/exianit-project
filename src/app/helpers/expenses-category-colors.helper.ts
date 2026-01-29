import { ExpensesCategory } from '../models/enums/expenses-category.enum';
import { ExpensesAnalytics } from '../models/expenses-analytics.interface';

export const EXPENSES_ANALYTICS_DICT: Record<ExpensesCategory, ExpensesAnalytics> = {
  [ExpensesCategory.House]: {
    category: ExpensesCategory.House,
    label: 'House',
    color: '#bd2b2b'
  },
  [ExpensesCategory.Food]: {
    category: ExpensesCategory.Food,
    label: 'Food',
    color: '#ff9900'
  },
  [ExpensesCategory.Groceries]: {
    category: ExpensesCategory.Groceries,
    label: 'Groceries',
    color: '#3c78d8'
  },
  [ExpensesCategory.Health]: {
    category: ExpensesCategory.Health,
    label: 'Health',
    color: '#00d5d5'
  },
  [ExpensesCategory.Shop]: {
    category: ExpensesCategory.Shop,
    label: 'Shop',
    color: '#2d7c57ff'
  },
  [ExpensesCategory.Leisure]: {
    category: ExpensesCategory.Leisure,
    label: 'Leisure',
    color: '#f3e304ff'
  },
  [ExpensesCategory.Donations]: {
    category: ExpensesCategory.Donations,
    label: 'Donations',
    color: '#c27ba0'
  },
  [ExpensesCategory.Transport]: {
    category: ExpensesCategory.Transport,
    label: 'Transport',
    color: '#674ea7'
  },
  [ExpensesCategory.Education]: {
    category: ExpensesCategory.Education,
    label: 'Education',
    color: '#353438ff'
  },
  [ExpensesCategory.TaxAndTributes]: {
    category: ExpensesCategory.TaxAndTributes,
    label: 'Tax & Tributes',
    color: '#bf9000'
  },
  [ExpensesCategory.Investments]: {
    category: ExpensesCategory.Investments,
    label: 'Investments',
    color: '#0404e1'
  },
  [ExpensesCategory.Others]: {
    category: ExpensesCategory.Others,
    label: 'Others',
    color: '#808080'
  }
};
