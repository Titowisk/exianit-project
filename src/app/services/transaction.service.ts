import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APP_CONFIG } from '../models/app-config.interface';
import { MonthlyExpensesByCategory, ExpensesSummaryTotals } from '../models/monthly-expenses-by-category.interface';
import { MonthlyIncomesByCategory } from '../models/monthly-incomes-by-category.interface';
import { Transaction } from '../models/transaction.interface';
import { Category } from '../models/enums/category.enum';
import { AuthService } from './auth.service';

interface ApiTransaction {
  id: string;
  type: string;
  origin: string;
  amount: number;
  date: string;
  category: string;
  description?: string;
  sourceStatementId: string;
}

export interface ExpensesSummaryResponse {
  monthlyExpenses: MonthlyExpensesByCategory[];
  averages: ExpensesSummaryTotals;
  totals: ExpensesSummaryTotals;
}

export interface IncomeSummaryTotals {
  salary: number;
  benefits: number;
  taxReturns: number;
  bonus: number;
  paidVacation: number;
  others: number;
}

export interface IncomesSummaryResponse {
  monthlyIncomes: MonthlyIncomesByCategory[];
  averages: IncomeSummaryTotals;
  totals: IncomeSummaryTotals;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private config = inject(APP_CONFIG);
  private get apiUrl() { return this.config.apiUrl; }

  getUserTransactionsByYear(year: number): Observable<Transaction[]> {
    const userId = this.authService.userId();
    const url = `${this.apiUrl}/transactions?userId=${userId}&year=${year}`;
    
    return this.http.get<ApiTransaction[]>(url)
      .pipe(
        map(transactions => this.mapApiResponse(transactions))
      );
  }

  private mapApiResponse(apiData: ApiTransaction[]): Transaction[] {
    return apiData.map(transaction => {
      const type = transaction.type.toLowerCase() as 'income' | 'expense';
      const category = this.mapCategoryToEnum(transaction.category, type);
      
      const d = new Date(transaction.date);
      return {
        id: transaction.id,
        type,
        origin: transaction.origin,
        amount: transaction.amount,
        date: new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
        category,
        description: transaction.description
      } as Transaction;
    });
  }

  private mapCategoryToEnum(category: string, type: 'income' | 'expense'): Category {
    const categoryEnum = Category[category as keyof typeof Category];
    if (!categoryEnum) {
      throw new Error(`Unknown category: ${category}`);
    }
    return categoryEnum;
  }

  updateCategory(transactionId: string, userId: string, category: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/transactions/${transactionId}/category-only?userId=${userId}`,
      { category }
    );
  }

  updateSimilarOriginCategory(transactionId: string, userId: string, category: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/transactions/${transactionId}/similar-origin?userId=${userId}`,
      { category }
    );
  }

  getExpenseSummary(userId: string, year: number): Observable<ExpensesSummaryResponse> {
    return this.http.get<ExpensesSummaryResponse>(
      `${this.apiUrl}/transactions/expense-summary?userId=${userId}&year=${year}`
    );
  }

  getIncomeSummary(userId: string, year: number): Observable<IncomesSummaryResponse> {
    return this.http.get<IncomesSummaryResponse>(
      `${this.apiUrl}/transactions/income-summary?userId=${userId}&year=${year}`
    );
  }

  updateTransactionDetails(transactionId: string, userId: string, date: string, description: string): Observable<{ id: string; date: string; description: string }> {
    return this.http.patch<{ id: string; date: string; description: string }>(
      `${this.apiUrl}/transactions/${transactionId}?userId=${userId}`,
      { date, description }
    );
  }

  deleteTransaction(transactionId: string, userId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/transactions/${transactionId}?userId=${userId}`
    );
  }

  createTransaction(
    sourceAccountId: string,
    type: 'income' | 'expense',
    origin: string,
    amount: number,
    date: string,
    category: number,
    description: string | null
  ): Observable<{ id: string }> {
    const userId = this.authService.userId();
    const typeMap: Record<'income' | 'expense', number> = { income: 1, expense: 2 };
    return this.http.post<{ id: string }>(
      `${this.apiUrl}/transactions?userId=${userId}`,
      {
        sourceAccountId,
        type: typeMap[type],
        origin,
        amount,
        date,
        category,
        description: description || null
      }
    );
  }
}
