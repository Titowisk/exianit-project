import { ExpensesCategory } from "./enums/expenses-category.enum";
import { IncomesCategory } from "./enums/incomes-category.enum";

export interface IncomeTransaction {
    id: string;
    type: 'income';
    origin: string;
    amount: number;
    date: Date;
    category: IncomesCategory;
    description?: string;
}

export interface ExpenseTransaction {
    id: string;
    type: 'expense';
    origin: string;
    amount: number;
    date: Date;
    category: ExpensesCategory;
    description?: string;
}

export type StatementTransaction = IncomeTransaction | ExpenseTransaction;