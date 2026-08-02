import { Category } from '../models/enums/category.enum';

/**
 * Maps category enum strings to their corresponding integer values expected by the API
 */
export function getCategoryValue(category: Category, type: 'expense' | 'income'): number {
  const categoryMap: Record<string, number> = {
    // Expense categories
    [Category.House]: 1,
    [Category.Food]: 2,
    [Category.Groceries]: 3,
    [Category.Health]: 4,
    [Category.Shop]: 5,
    [Category.Leisure]: 6,
    [Category.Donations]: 7,
    [Category.Transport]: 8,
    [Category.Education]: 9,
    [Category.TaxAndTributes]: 10,
    [Category.Investments]: 11,
    
    // Income categories
    [Category.Salary]: 50,
    [Category.Benefits]: 51,
    [Category.TaxReturns]: 52,
    [Category.Bonus]: 53,
    [Category.PaidVacation]: 54,
    
    // Shared categories
    [Category.Vacation]: 12,
    [Category.Others]: 99,
    [Category.Uncategorized]: 0,
  };

  return categoryMap[category] ?? 99; // Default to Others if not found
}

/**
 * Returns valid categories for a given transaction type
 */
export function getCategoriesByType(type: 'expense' | 'income'): Category[] {
  if (type === 'expense') {
    return [
      Category.House,
      Category.Food,
      Category.Groceries,
      Category.Health,
      Category.Shop,
      Category.Leisure,
      Category.Donations,
      Category.Transport,
      Category.Education,
      Category.TaxAndTributes,
      Category.Investments,
      Category.Vacation,
      Category.Others,
      Category.Uncategorized
    ];
  } else {
    return [
      Category.Salary,
      Category.Benefits,
      Category.TaxReturns,
      Category.Bonus,
      Category.PaidVacation,
      Category.Others,
      Category.Uncategorized
    ];
  }
}
