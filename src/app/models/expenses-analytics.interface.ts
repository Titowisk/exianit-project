import { ExpensesCategory } from "./enums/expenses-category.enum";

export interface ExpensesAnalytics {
    category: ExpensesCategory;
    label: string;
    color: string; // hexadecimal color code
}