import { Category } from "./enums/category.enum";
import { Tag } from "./tag.interface";

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
    tag?: Tag | null;
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
    tag?: Tag | null;
}

export type Transaction = IncomeTransaction | ExpenseTransaction;
