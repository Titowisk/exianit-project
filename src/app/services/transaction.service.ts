import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MonthlyExpensesByCategory, ExpensesSummaryTotals } from '../models/monthly-expenses-by-category.interface';

export interface ExpensesSummaryResponse {
  monthlyExpenses: MonthlyExpensesByCategory[];
  averages: ExpensesSummaryTotals;
  totals: ExpensesSummaryTotals;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7080/api';

  updateCategory(transactionId: string, userId: string, category: number): Observable<void> {
    return this.http.patch<void>(
      `${this.apiUrl}/transactions/${transactionId}?userId=${userId}`,
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
}
