import { Component, inject, signal } from '@angular/core';
import { StatementService } from '../statement.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { getCategoryValue } from '../../helpers/category-enum.helper';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { YearService } from '../../header/year.service';
import { StatementTransaction } from '../../models/statement.interface';
import { ExpensesCategory } from '../../models/enums/expenses-category.enum';
import { IncomesCategory } from '../../models/enums/incomes-category.enum';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-statement',
  imports: [TableModule, CommonModule, FormsModule, Select, Button, ProgressSpinner],
  templateUrl: './statement.component.html',
  styleUrl: './statement.component.scss'
})
export class StatementComponent {
  private statementService = inject(StatementService);
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  yearService = inject(YearService);

  transactions = signal<StatementTransaction[]>([]);
  isLoading = signal<boolean>(false);
  editingId = signal<string | null>(null);
  editingCategory = signal<string>('');
  savingId = signal<string | null>(null);

  constructor() {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.isLoading.set(true);
    this.statementService.getAllStatements().subscribe({
      next: (data) => {
        this.transactions.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        const errorMessage = error?.error?.message || error?.message || 'Failed to load statements. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Load Failed',
          detail: errorMessage,
          life: 5000
        });
      }
    });
  }

  getCategoryOptions(transaction: StatementTransaction): { label: string; value: string }[] {
    if (transaction.type === 'expense') {
      return Object.values(ExpensesCategory).map(cat => ({
        label: cat,
        value: cat
      }));
    } else {
      return Object.values(IncomesCategory).map(cat => ({
        label: cat,
        value: cat
      }));
    }
  }

  startEdit(transaction: StatementTransaction): void {
    this.editingId.set(transaction.id);
    this.editingCategory.set(transaction.category);
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editingCategory.set('');
  }

  saveCategory(transaction: StatementTransaction): void {
    const userId = this.authService.userId();
    if (!userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'User not authenticated',
        life: 5000
      });
      return;
    }

    const categoryValue = getCategoryValue(this.editingCategory() as ExpensesCategory | IncomesCategory);
    this.savingId.set(transaction.id);

    this.transactionService.updateCategory(transaction.id, userId, categoryValue).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Category Updated',
          detail: 'Transaction category updated successfully',
          life: 3000
        });
        this.cancelEdit();
        this.savingId.set(null);
        this.loadTransactions();
      },
      error: (error) => {
        this.savingId.set(null);
        const errorMessage = error?.error?.message || error?.message || 'Failed to update category. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: errorMessage,
          life: 5000
        });
      }
    });
  }

  saveSimilarOriginCategory(transaction: StatementTransaction): void {
    const userId = this.authService.userId();
    if (!userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Authentication Error',
        detail: 'User not authenticated',
        life: 5000
      });
      return;
    }

    const categoryValue = getCategoryValue(this.editingCategory() as ExpensesCategory | IncomesCategory);
    this.savingId.set(transaction.id);

    this.transactionService.updateSimilarOriginCategory(transaction.id, userId, categoryValue).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Categories Updated',
          detail: `All transactions from "${transaction.origin}" updated successfully`,
          life: 3000
        });
        this.cancelEdit();
        this.savingId.set(null);
        this.loadTransactions();
      },
      error: (error) => {
        this.savingId.set(null);
        const errorMessage = error?.error?.message || error?.message || 'Failed to update categories. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: errorMessage,
          life: 5000
        });
      }
    });
  }
}
