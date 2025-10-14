import { ExpensesCategory } from "./expenses-category.enum";
import { IncomesCategory } from "./incomes-category.enum";

export interface IncomeStatement {
    id: number;
    type: 'income';
    origin: string;
    amount: number;
    date: Date;
    category: IncomesCategory;
    description?: string;
}

export interface ExpenseStatement {
    id: number;
    type: 'expense';
    origin: string;
    amount: number;
    date: Date;
    category: ExpensesCategory;
    description?: string;
}

export type Statement = IncomeStatement | ExpenseStatement;