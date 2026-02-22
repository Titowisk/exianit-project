import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SourceAccount } from '../models/source-account.interface';
import { ImportResponse } from '../models/import-response.interface';
import { SourceStatementType } from '../models/enums/source-statement-type.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SourceAccountService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'https://localhost:7080/api';

  getSourceAccounts(): Observable<SourceAccount[]> {
    const userId = this.authService.userId();
    return this.http.get<SourceAccount[]>(`${this.apiUrl}/source-accounts?userId=${userId}`);
  }

  createSourceAccount(name: string, source: number): Observable<SourceAccount> {
    const userId = this.authService.userId();
    return this.http.post<SourceAccount>(`${this.apiUrl}/source-accounts/${userId}`, { name, source });
  }

  uploadStatement(accountId: string, statementType: SourceStatementType, file: File): Observable<ImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('statement-type', statementType.toString());

    return this.http.post<ImportResponse>(`${this.apiUrl}/source-accounts/${accountId}/statements`, formData);
  }
}
