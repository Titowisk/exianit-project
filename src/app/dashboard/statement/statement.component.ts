import { Component, inject, signal } from '@angular/core';
import { StatementService } from '../statement.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { getCategoryValue, getCategoriesByType } from '../../helpers/category-enum.helper';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { YearService } from '../../header/year.service';
import { StatementTransaction } from '../../models/statement.interface';
import { Category } from '../../models/enums/category.enum';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Tooltip } from 'primeng/tooltip';
import { ErrorHandlerService } from '../../services/error-handler.service';

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
  private errorHandler = inject(ErrorHandlerService);
  yearService = inject(YearService);

  transactions = signal<StatementTransaction[]>([]);
  isLoading = signal<boolean>(false);
  categorizingId = signal<string | null>(null);
  editingCategory = signal<string>('');
  savingId = signal<string | null>(null);
  categoryBackendErrors = signal<Record<string, string[]>>({});
  
  showEditModal = signal<boolean>(false);
  selectedTransaction = signal<StatementTransaction | null>(null);
  editedDate = signal<Date | null>(null);
  editedDescription = signal<string>('');
  isSavingDetails = signal<boolean>(false);
  detailsBackendErrors = signal<Record<string, string[]>>({});
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
        this.errorHandler.showErrorToast(error, 'Load Failed', 'Failed to load statements. Please try again.');
      }
    });
  }

  getCategoryOptions(transaction: StatementTransaction): { label: string; value: string }[] {
    const categories = getCategoriesByType(transaction.type);
    return categories.map(cat => ({
      label: cat,
      value: cat
    }));
  }

  startCategorize(transaction: StatementTransaction): void {
    this.categorizingId.set(transaction.id);
    this.editingCategory.set(transaction.category);
    this.categoryBackendErrors.set({}); // Clear errors when starting edit
  }

  onCategoryChange(): void {
    // Clear backend errors when category is changed
    this.categoryBackendErrors.set({});
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

    const categoryValue = getCategoryValue(this.editingCategory() as Category, transaction.type);
    this.savingId.set(transaction.id);
    this.categoryBackendErrors.set({});

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
        
        // Extract field-specific validation errors
        const fieldErrors = this.errorHandler.getFieldErrors(error);
        this.categoryBackendErrors.set(fieldErrors);
        
        // Show error toast
        this.errorHandler.showErrorToast(error, 'Update Failed', 'Failed to update category. Please try again.');
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

    const categoryValue = getCategoryValue(this.editingCategory() as Category, transaction.type);
    this.savingId.set(transaction.id);
    this.categoryBackendErrors.set({});

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
        
        // Extract field-specific validation errors
        const fieldErrors = this.errorHandler.getFieldErrors(error);
        this.categoryBackendErrors.set(fieldErrors);
        
        // Show error toast
        this.errorHandler.showErrorToast(error, 'Update Failed', 'Failed to update categories. Please try again.');
      }
    });
  }

  openEditModal(transaction: StatementTransaction): void {
    this.cancelEdit();
    this.selectedTransaction.set(transaction);
    this.editedDate.set(new Date(transaction.date));
    this.editedDescription.set(transaction.description || '');
    this.detailsBackendErrors.set({}); // Clear errors when opening modal
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
    this.selectedTransaction.set(null);
    this.editedDate.set(null);
    this.editedDescription.set('');
    this.detailsBackendErrors.set({});
  }

  onDateChange(): void {
    // Clear backend date errors when date is changed
    const currentErrors = this.detailsBackendErrors();
    const { date, ...restErrors } = currentErrors;
    this.detailsBackendErrors.set(restErrors);
  }

  onDescriptionChange(): void {
    // Clear backend description errors when description is changed
    const currentErrors = this.detailsBackendErrors();
    const { description, ...restErrors } = currentErrors;
    this.detailsBackendErrors.set(restErrors);
  }

  getBackendErrors(field: string): string[] {
    return this.detailsBackendErrors()[field] || [];
  }

  getCategoryBackendErrors(field: string): string[] {
    return this.categoryBackendErrors()[field] || [];
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
    this.detailsBackendErrors.set({});

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
        
        // Extract field-specific validation errors
        const fieldErrors = this.errorHandler.getFieldErrors(error);
        this.detailsBackendErrors.set(fieldErrors);
        
        // Show error toast
        this.errorHandler.showErrorToast(error, 'Update Failed', 'Failed to update transaction. Please try again.');
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
            this.errorHandler.showErrorToast(error, 'Delete Failed', 'Failed to delete transaction. Please try again.');
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
