import { Category } from "./enums/category.enum";

export interface IncomeTransaction {
    id: string;
    type: 'income';
    origin: string;
    amount: number;
    date: Date;
    category: Category;
    description?: string;
}

export interface ExpenseTransaction {
    id: string;
    type: 'expense';
    origin: string;
    amount: number;
    date: Date;
    category: Category;
    description?: string;
}

export type Transaction = IncomeTransaction | ExpenseTransaction;
