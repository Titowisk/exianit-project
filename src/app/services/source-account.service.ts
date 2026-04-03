import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SourceAccount } from '../models/source-account.interface';
import { ImportResponse } from '../models/import-response.interface';
import { AuthService } from './auth.service';
import { APP_CONFIG } from '../models/app-config.interface';

@Injectable({
  providedIn: 'root'
})
export class SourceAccountService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = inject(APP_CONFIG).apiUrl;

  getSourceAccounts(): Observable<SourceAccount[]> {
    const userId = this.authService.userId();
    return this.http.get<SourceAccount[]>(`${this.apiUrl}/source-accounts?userId=${userId}`);
  }

  createSourceAccount(name: string, source: number): Observable<SourceAccount> {
    const userId = this.authService.userId();
    return this.http.post<SourceAccount>(`${this.apiUrl}/source-accounts/${userId}`, { name, source });
  }

  uploadStatement(accountId: string, statementType: number, file: File): Observable<ImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('statement-type', statementType.toString());

    return this.http.post<ImportResponse>(`${this.apiUrl}/source-accounts/${accountId}/statements`, formData);
  }
}
