import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MonthlyExpensesByCategory, ExpensesSummaryTotals } from '../models/monthly-expenses-by-category.interface';
import { MonthlyIncomesByCategory } from '../models/monthly-incomes-by-category.interface';

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
  private apiUrl = 'https://localhost:7080/api';

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
}
