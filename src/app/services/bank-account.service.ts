import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BankAccount } from '../models/bank-account.interface';
import { ImportResponse } from '../models/import-response.interface';
import { BankStatementType } from '../models/enums/bank-statement-type.enum';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'https://localhost:7080/api';

  getBankAccounts(): Observable<BankAccount[]> {
    const userId = this.authService.userId();
    return this.http.get<BankAccount[]>(`${this.apiUrl}/bank-accounts?userId=${userId}`);
  }

  uploadStatement(accountId: string, statementType: BankStatementType, file: File): Observable<ImportResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('statement-type', statementType.toString());

    return this.http.post<ImportResponse>(`${this.apiUrl}/bank-accounts/${accountId}/statements`, formData);
  }
}
