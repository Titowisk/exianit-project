import { Category } from "./enums/category.enum";

export interface TransactionSourceAccount {
    name: string;
    source: { id: number; name: string };
}

export interface IncomeTransaction {
    id: string;
    type: 'income';
    origin: string;
    amount: number;
    date: Date;
    category: Category;
    description?: string;
    sourceAccount?: TransactionSourceAccount;
}

export interface ExpenseTransaction {
    id: string;
    type: 'expense';
    origin: string;
    amount: number;
    date: Date;
    category: Category;
    description?: string;
    sourceAccount?: TransactionSourceAccount;
}

export type Transaction = IncomeTransaction | ExpenseTransaction;
