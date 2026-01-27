import { ExpensesCategory } from '../models/enums/expenses-category.enum';
import { IncomesCategory } from '../models/enums/incomes-category.enum';

/**
 * Maps category enum strings to their corresponding integer values expected by the API
 */
export function getCategoryValue(category: ExpensesCategory | IncomesCategory): number {
  const categoryMap: Record<string, number> = {
    // Expenses categories
    [ExpensesCategory.House]: 1,
    [ExpensesCategory.Food]: 2,
    [ExpensesCategory.Groceries]: 3,
    [ExpensesCategory.Health]: 4,
    [ExpensesCategory.Shop]: 5,
    [ExpensesCategory.Leisure]: 6,
    [ExpensesCategory.Donations]: 7,
    [ExpensesCategory.Transport]: 8,
    [ExpensesCategory.Education]: 9,
    [ExpensesCategory.TaxAndTributes]: 10,
    [ExpensesCategory.Investments]: 11,
    
    // Incomes categories
    [IncomesCategory.Salary]: 50,
    [IncomesCategory.Benefits]: 51,
    [IncomesCategory.TaxReturns]: 52,
    [IncomesCategory.Bonus]: 53,
    [IncomesCategory.PaidVacation]: 54,

    // Generic
    [IncomesCategory.Others]: 99,
  };

  return categoryMap[category] ?? 12; // Default to Others (Expenses) if not found
}
