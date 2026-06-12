import { Category } from '../models/enums/category.enum';
import { CategoryAnalytics } from '../models/category-analytics.interface';

export const CATEGORY_COLORS: Record<Category, CategoryAnalytics> = {
  // Expense categories
  [Category.House]: {
    category: Category.House,
    label: 'House',
    color: '#bd2b2b'
  },
  [Category.Food]: {
    category: Category.Food,
    label: 'Food',
    color: '#ff9900'
  },
  [Category.Groceries]: {
    category: Category.Groceries,
    label: 'Groceries',
    color: '#3c78d8'
  },
  [Category.Health]: {
    category: Category.Health,
    label: 'Health',
    color: '#00d5d5'
  },
  [Category.Shop]: {
    category: Category.Shop,
    label: 'Shop',
    color: '#2d7c57ff'
  },
  [Category.Leisure]: {
    category: Category.Leisure,
    label: 'Leisure',
    color: '#ff6e4a'
  },
  [Category.Donations]: {
    category: Category.Donations,
    label: 'Donations',
    color: '#c27ba0'
  },
  [Category.Transport]: {
    category: Category.Transport,
    label: 'Transport',
    color: '#674ea7'
  },
  [Category.Education]: {
    category: Category.Education,
    label: 'Education',
    color: '#353438ff'
  },
  [Category.TaxAndTributes]: {
    category: Category.TaxAndTributes,
    label: 'Tax & Tributes',
    color: '#bf9000'
  },
  [Category.Investments]: {
    category: Category.Investments,
    label: 'Investments',
    color: '#0404e1'
  },
  [Category.Vacation]: {
    category: Category.Vacation,
    label: 'Vacation',
    color: '#7dbafb'
  },
  
  // Income categories
  [Category.Salary]: {
    category: Category.Salary,
    label: 'Salary',
    color: '#34a853'
  },
  [Category.Benefits]: {
    category: Category.Benefits,
    label: 'Benefits',
    color: '#2d8e47'
  },
  [Category.TaxReturns]: {
    category: Category.TaxReturns,
    label: 'Tax Returns',
    color: '#26743b'
  },
  [Category.Bonus]: {
    category: Category.Bonus,
    label: 'Bonus',
    color: '#1f5a2f'
  },
  [Category.PaidVacation]: {
    category: Category.PaidVacation,
    label: 'Paid Vacation',
    color: '#184023'
  },
  
  // Shared categories
  [Category.Others]: {
    category: Category.Others,
    label: 'Others',
    color: '#808080'
  },
  [Category.Uncategorized]: {
    category: Category.Uncategorized,
    label: 'Uncategorized',
    color: '#cccccc'
  }
};
