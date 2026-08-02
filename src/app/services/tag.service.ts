import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.interface';
import { TaggedSummaryResponse } from '../models/tagged-summary.interface';
import { AuthService } from './auth.service';
import { APP_CONFIG } from '../models/app-config.interface';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private config = inject(APP_CONFIG);
  private get apiUrl() { return this.config.apiUrl; }

  getTags(): Observable<Tag[]> {
    const userId = this.authService.userId();
    return this.http.get<Tag[]>(`${this.apiUrl}/tags?userId=${userId}`);
  }

  createTag(name: string, color: string): Observable<Tag> {
    const userId = this.authService.userId();
    return this.http.post<Tag>(`${this.apiUrl}/tags?userId=${userId}`, { name, color });
  }

  updateTag(tagId: string, changes: { name?: string; color?: string }): Observable<Tag> {
    const userId = this.authService.userId();
    return this.http.patch<Tag>(`${this.apiUrl}/tags/${tagId}?userId=${userId}`, changes);
  }

  deleteTag(tagId: string): Observable<void> {
    const userId = this.authService.userId();
    return this.http.delete<void>(`${this.apiUrl}/tags/${tagId}?userId=${userId}`);
  }

  getTaggedExpenseSummary(year: number): Observable<TaggedSummaryResponse> {
    const userId = this.authService.userId();
    return this.http.get<TaggedSummaryResponse>(
      `${this.apiUrl}/transactions/tagged-expense-summary?userId=${userId}&year=${year}`
    );
  }

  getTaggedIncomeSummary(year: number): Observable<TaggedSummaryResponse> {
    const userId = this.authService.userId();
    return this.http.get<TaggedSummaryResponse>(
      `${this.apiUrl}/transactions/tagged-income-summary?userId=${userId}&year=${year}`
    );
  }

  tagTransaction(transactionId: string, tagId: string | null): Observable<void> {
    const userId = this.authService.userId();
    return this.http.patch<void>(
      `${this.apiUrl}/transactions/${transactionId}/tag?userId=${userId}`,
      { tagId }
    );
  }

  tagSimilarOriginTransactions(transactionId: string, tagId: string | null): Observable<{ updatedCount: number }> {
    const userId = this.authService.userId();
    return this.http.patch<{ updatedCount: number }>(
      `${this.apiUrl}/transactions/${transactionId}/similar-origin-tag?userId=${userId}`,
      { tagId }
    );
  }
}
