import { Component, inject, signal } from '@angular/core';
import { StatementService } from '../statement.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { getCategoryValue } from '../../helpers/category-enum.helper';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { YearService } from '../../header/year.service';
import { StatementTransaction } from '../../models/statement.interface';
import { ExpensesCategory } from '../../models/enums/expenses-category.enum';
import { IncomesCategory } from '../../models/enums/incomes-category.enum';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-statement',
  imports: [TableModule, CommonModule, FormsModule, Select, Button, ProgressSpinner, Dialog, DatePicker, InputText, ConfirmDialog, Tooltip],
  providers: [ConfirmationService],
  templateUrl: './statement.component.html',
  styleUrl: './statement.component.scss'
})
export class StatementComponent {
  private statementService = inject(StatementService);
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  yearService = inject(YearService);

  transactions = signal<StatementTransaction[]>([]);
  isLoading = signal<boolean>(false);
  categorizingId = signal<string | null>(null);
  editingCategory = signal<string>('');
  savingId = signal<string | null>(null);
  
  showEditModal = signal<boolean>(false);
  selectedTransaction = signal<StatementTransaction | null>(null);
  editedDate = signal<Date | null>(null);
  editedDescription = signal<string>('');
  isSavingDetails = signal<boolean>(false);
  deletingId = signal<string | null>(null);

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

  startCategorize(transaction: StatementTransaction): void {
    this.categorizingId.set(transaction.id);
    this.editingCategory.set(transaction.category);
  }

  cancelEdit(): void {
    this.categorizingId.set(null);
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

  openEditModal(transaction: StatementTransaction): void {
    this.cancelEdit();
    this.selectedTransaction.set(transaction);
    this.editedDate.set(new Date(transaction.date));
    this.editedDescription.set(transaction.description || '');
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedTransaction.set(null);
    this.editedDate.set(null);
    this.editedDescription.set('');
  }

  saveDetails(): void {
    const userId = this.authService.userId();
    const transaction = this.selectedTransaction();
    const date = this.editedDate();
    const description = this.editedDescription();

    if (!userId || !transaction || !date || !description.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        life: 5000
      });
      return;
    }

    const isoDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)).toISOString();
    this.isSavingDetails.set(true);

    this.transactionService.updateTransactionDetails(transaction.id, userId, isoDate, description).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Transaction Updated',
          detail: 'Transaction updated successfully',
          life: 3000
        });
        this.closeEditModal();
        this.isSavingDetails.set(false);
        this.loadTransactions();
      },
      error: (error) => {
        this.isSavingDetails.set(false);
        const errorMessage = error?.error?.message || error?.message || 'Failed to update transaction. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: errorMessage,
          life: 5000
        });
      }
    });
  }

  deleteTransaction(transaction: StatementTransaction): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this transaction from "${transaction.origin}" (${transaction.amount})?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
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

        this.deletingId.set(transaction.id);
        this.transactionService.deleteTransaction(transaction.id, userId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Transaction Deleted',
              detail: 'Transaction deleted successfully',
              life: 3000
            });
            this.deletingId.set(null);
            this.loadTransactions();
          },
          error: (error) => {
            this.deletingId.set(null);
            const errorMessage = error?.error?.message || error?.message || 'Failed to delete transaction. Please try again.';
            this.messageService.add({
              severity: 'error',
              summary: 'Delete Failed',
              detail: errorMessage,
              life: 5000
            });
          }
        });
      }
    });
  }

  isFormValid(): boolean {
    const date = this.editedDate();
    const description = this.editedDescription();
    return date !== null && description.trim().length > 0;
  }
}
