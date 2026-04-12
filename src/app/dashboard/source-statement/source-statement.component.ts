import { Component, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { SourceAccountService } from '../../services/source-account.service';
import { SourceStatementService } from '../../services/source-statement.service';
import { SourceAccount } from '../../models/source-account.interface';
import { SourceStatement } from '../../models/source-statement.interface';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-source-statement',
  imports: [CommonModule, FormsModule, TableModule, Select, Button, ProgressSpinner, ConfirmDialog],
  providers: [ConfirmationService],
  templateUrl: './source-statement.component.html',
  styleUrl: './source-statement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceStatementComponent {
  private sourceAccountService = inject(SourceAccountService);
  private sourceStatementService = inject(SourceStatementService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private errorHandler = inject(ErrorHandlerService);

  isLoadingAccounts = signal(false);
  isLoadingStatements = signal(false);
  sourceAccounts = signal<SourceAccount[]>([]);
  selectedAccount = signal<SourceAccount | null>(null);
  sourceStatements = signal<SourceStatement[]>([]);
  deletingId = signal<string | null>(null);

  constructor() {
    this.loadSourceAccounts();

    effect(() => {
      const account = this.selectedAccount();
      if (account) {
        this.loadSourceStatements(account.id);
      } else {
        this.sourceStatements.set([]);
      }
    });
  }

  private loadSourceAccounts(): void {
    this.isLoadingAccounts.set(true);
    this.sourceAccountService.getSourceAccounts().subscribe({
      next: (accounts) => {
        this.sourceAccounts.set(accounts);
        this.isLoadingAccounts.set(false);
      },
      error: (error) => {
        this.isLoadingAccounts.set(false);
        this.errorHandler.showErrorToast(error, 'Load Failed', 'Failed to load source accounts.');
      }
    });
  }

  private loadSourceStatements(sourceAccountId: string): void {
    this.isLoadingStatements.set(true);
    this.sourceStatementService.getSourceStatements(sourceAccountId).subscribe({
      next: (statements) => {
        this.sourceStatements.set(statements);
        this.isLoadingStatements.set(false);
      },
      error: (error) => {
        this.isLoadingStatements.set(false);
        this.errorHandler.showErrorToast(error, 'Load Failed', 'Failed to load source statements.');
      }
    });
  }

  deleteStatement(statement: SourceStatement): void {
    this.confirmationService.confirm({
      message: `Warning: deleting this source statement will permanently delete all <strong>${statement.transactionCount}</strong> related transactions. This action cannot be undone.`,
      header: 'Delete Source Statement',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deletingId.set(statement.id);
        this.sourceStatementService.deleteSourceStatement(statement.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Statement Deleted',
              detail: 'Source statement and its transactions were deleted successfully.',
              life: 3000
            });
            this.deletingId.set(null);
            const account = this.selectedAccount();
            if (account) {
              this.loadSourceStatements(account.id);
            }
          },
          error: (error) => {
            this.deletingId.set(null);
            this.errorHandler.showErrorToast(error, 'Delete Failed', 'Failed to delete source statement. Please try again.');
          }
        });
      }
    });
  }
}
