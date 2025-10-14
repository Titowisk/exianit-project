import { Injectable } from '@angular/core';
import { Statement } from "../models/statement.interface";
import { IncomesCategory } from "../models/enums/incomes-category.enum";
import { ExpensesCategory } from "../models/enums/expenses-category.enum";

@Injectable({
    providedIn: 'root'
})
export class StatementService {
    private statements: Statement[] = [
        // Income Statements
        {
            id: 1,
            type: 'income',
            origin: 'Bank Transfer',
            amount: 5000.00,
            date: new Date('2024-10-01'),
            category: IncomesCategory.Salary,
            description: 'Monthly salary payment'
        },
        {
            id: 2,
            type: 'income',
            origin: 'Bank Transfer',
            amount: 1200.00,
            date: new Date('2024-10-05'),
            category: IncomesCategory.Benefits,
            description: 'Health insurance benefit'
        },
        {
            id: 3,
            type: 'income',
            origin: 'Bank Transfer',
            amount: 4800.00,
            date: new Date('2024-09-30'),
            category: IncomesCategory.Salary,
            description: 'September salary'
        },
        {
            id: 4,
            type: 'income',
            origin: 'Direct Deposit',
            amount: 300.00,
            date: new Date('2024-10-10'),
            category: IncomesCategory.Benefits,
            description: 'Performance bonus'
        },
        {
            id: 5,
            type: 'income',
            origin: 'Bank Transfer',
            amount: 5000.00,
            date: new Date('2024-10-15'),
            category: IncomesCategory.Salary,
            description: 'Mid-month salary advance'
        },
        
        // Expense Statements
        {
            id: 6,
            type: 'expense',
            origin: 'Credit Card',
            amount: 85.50,
            date: new Date('2024-10-02'),
            category: ExpensesCategory.Food,
            description: 'Dinner at restaurant'
        },
        {
            id: 7,
            type: 'expense',
            origin: 'Debit Card',
            amount: 120.75,
            date: new Date('2024-10-03'),
            category: ExpensesCategory.Groceries,
            description: 'Weekly grocery shopping'
        },
        {
            id: 8,
            type: 'expense',
            origin: 'Bank Transfer',
            amount: 1200.00,
            date: new Date('2024-10-01'),
            category: ExpensesCategory.House,
            description: 'Monthly rent payment'
        },
        {
            id: 9,
            type: 'expense',
            origin: 'Credit Card',
            amount: 45.00,
            date: new Date('2024-10-04'),
            category: ExpensesCategory.Transport,
            description: 'Gas station fill-up'
        },
        {
            id: 10,
            type: 'expense',
            origin: 'Debit Card',
            amount: 25.99,
            date: new Date('2024-10-05'),
            category: ExpensesCategory.Leisure,
            description: 'Movie ticket'
        },
        {
            id: 11,
            type: 'expense',
            origin: 'Credit Card',
            amount: 180.00,
            date: new Date('2024-10-06'),
            category: ExpensesCategory.Health,
            description: 'Doctor visit copay'
        },
        {
            id: 12,
            type: 'expense',
            origin: 'Debit Card',
            amount: 89.99,
            date: new Date('2024-10-07'),
            category: ExpensesCategory.Shop,
            description: 'Clothing purchase'
        },
        {
            id: 13,
            type: 'expense',
            origin: 'Bank Transfer',
            amount: 50.00,
            date: new Date('2024-10-08'),
            category: ExpensesCategory.Donations,
            description: 'Charity donation'
        },
        {
            id: 14,
            type: 'expense',
            origin: 'Credit Card',
            amount: 250.00,
            date: new Date('2024-10-09'),
            category: ExpensesCategory.Education,
            description: 'Online course subscription'
        },
        {
            id: 15,
            type: 'expense',
            origin: 'Bank Transfer',
            amount: 350.00,
            date: new Date('2024-10-10'),
            category: ExpensesCategory.TaxAndTributes,
            description: 'Property tax payment'
        },
        {
            id: 16,
            type: 'expense',
            origin: 'Credit Card',
            amount: 75.25,
            date: new Date('2024-10-11'),
            category: ExpensesCategory.Food,
            description: 'Lunch delivery'
        },
        {
            id: 17,
            type: 'expense',
            origin: 'Debit Card',
            amount: 145.80,
            date: new Date('2024-10-12'),
            category: ExpensesCategory.Groceries,
            description: 'Bulk grocery shopping'
        },
        {
            id: 18,
            type: 'expense',
            origin: 'Bank Transfer',
            amount: 500.00,
            date: new Date('2024-10-13'),
            category: ExpensesCategory.Investments,
            description: 'Monthly investment contribution'
        },
        {
            id: 19,
            type: 'expense',
            origin: 'Credit Card',
            amount: 65.00,
            date: new Date('2024-10-14'),
            category: ExpensesCategory.Transport,
            description: 'Public transport monthly pass'
        },
        {
            id: 20,
            type: 'expense',
            origin: 'Debit Card',
            amount: 32.50,
            date: new Date('2024-10-15'),
            category: ExpensesCategory.Leisure,
            description: 'Coffee shop visit'
        }
    ];

    getAllStatements(): Statement[] {
        return this.statements;
    }
}