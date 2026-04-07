import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SourceStatement } from '../models/source-statement.interface';
import { APP_CONFIG } from '../models/app-config.interface';

@Injectable({
  providedIn: 'root'
})
export class SourceStatementService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);
  private get apiUrl() { return this.config.apiUrl; }

  getSourceStatements(sourceAccountId: string): Observable<SourceStatement[]> {
    return this.http.get<SourceStatement[]>(`${this.apiUrl}/source-statements?sourceAccountId=${sourceAccountId}`);
  }

  deleteSourceStatement(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/source-statements/${id}`);
  }
}
