import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { BankAccountService } from '../../services/bank-account.service';
import { BankAccount } from '../../models/bank-account.interface';
import { Bank } from '../../models/enums/bank.enum';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-bank-account',
  imports: [CommonModule, ReactiveFormsModule, InputText, Button, Select, TableModule],
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankAccountComponent {
  private fb = inject(FormBuilder);
  private bankAccountService = inject(BankAccountService);
  private messageService = inject(MessageService);
  private errorHandler = inject(ErrorHandlerService);

  isLoading = signal(false);
  bankAccounts = signal<BankAccount[]>([]);
  backendErrors = signal<Record<string, string[]>>({});

  bankForm: FormGroup;
  bankOptions = [
    { label: 'BTG', value: Bank.BTG },
    { label: 'NUBANK', value: Bank.NUBANK }
  ];

  constructor() {
    this.bankForm = this.fb.group({
      name: ['', [Validators.required]],
      bank: [null, [Validators.required]]
    });

    // Clear backend errors when form values change
    this.bankForm.valueChanges.subscribe(() => {
      const currentErrors = this.backendErrors();
      const clearedErrors: Record<string, string[]> = {};
      
      // Keep errors for fields that haven't changed
      Object.keys(currentErrors).forEach(field => {
        if (this.bankForm.get(field)?.pristine) {
          clearedErrors[field] = currentErrors[field];
        }
      });
      
      this.backendErrors.set(clearedErrors);
    });

    this.loadBankAccounts();
  }

  get name() {
    return this.bankForm.get('name');
  }

  get bank() {
    return this.bankForm.get('bank');
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.bankForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }

  getBackendErrors(field: string): string[] {
    return this.backendErrors()[field] || [];
  }

  getBankLabel(bankValue: number): string {
    switch (bankValue) {
      case Bank.BTG:
        return 'BTG';
      case Bank.NUBANK:
        return 'NUBANK';
      default:
        return 'Unknown';
    }
  }

  loadBankAccounts(): void {
    this.bankAccountService.getBankAccounts().subscribe({
      next: (accounts) => {
        this.bankAccounts.set(accounts);
      },
      error: (error) => {
        this.errorHandler.showErrorToast(error, 'Error Loading Accounts', 'Failed to load bank accounts.');
      }
    });
  }

  onSubmit(): void {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.backendErrors.set({});

    const { name, bank } = this.bankForm.value;

    this.bankAccountService.createBankAccount(name, bank).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Account Created',
          detail: 'Bank account created successfully!',
          life: 3000
        });
        this.bankForm.reset();
        this.backendErrors.set({});
        this.loadBankAccounts();
      },
      error: (error) => {
        this.isLoading.set(false);
        
        // Extract field-specific validation errors
        const fieldErrors = this.errorHandler.getFieldErrors(error);
        this.backendErrors.set(fieldErrors);
        
        // Show error toast
        this.errorHandler.showErrorToast(error, 'Creation Failed', 'An error occurred while creating the bank account.');
      }
    });
  }
}
