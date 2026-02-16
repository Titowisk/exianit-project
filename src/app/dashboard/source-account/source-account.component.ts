import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { SourceAccountService } from '../../services/source-account.service';
import { SourceAccount } from '../../models/source-account.interface';
import { Source } from '../../models/enums/source.enum';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-source-account',
  imports: [CommonModule, ReactiveFormsModule, InputText, Button, Select, TableModule],
  templateUrl: './source-account.component.html',
  styleUrl: './source-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SourceAccountComponent {
  private fb = inject(FormBuilder);
  private sourceAccountService = inject(SourceAccountService);
  private messageService = inject(MessageService);
  private errorHandler = inject(ErrorHandlerService);

  isLoading = signal(false);
  sourceAccounts = signal<SourceAccount[]>([]);
  backendErrors = signal<Record<string, string[]>>({});

  sourceForm: FormGroup;
  sourceOptions = [
    { label: 'BTG', value: Source.BTG },
    { label: 'NUBANK', value: Source.NUBANK }
  ];

  constructor() {
    this.sourceForm = this.fb.group({
      name: ['', [Validators.required]],
      source: [null, [Validators.required]]
    });

    // Clear backend errors when form values change
    this.sourceForm.valueChanges.subscribe(() => {
      const currentErrors = this.backendErrors();
      const clearedErrors: Record<string, string[]> = {};
      
      // Keep errors for fields that haven't changed
      Object.keys(currentErrors).forEach(field => {
        if (this.sourceForm.get(field)?.pristine) {
          clearedErrors[field] = currentErrors[field];
        }
      });
      
      this.backendErrors.set(clearedErrors);
    });

    this.loadSourceAccounts();
  }

  get name() {
    return this.sourceForm.get('name');
  }

  get source() {
    return this.sourceForm.get('source');
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.sourceForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }

  getBackendErrors(field: string): string[] {
    return this.backendErrors()[field] || [];
  }

  getSourceLabel(sourceValue: number): string {
    switch (sourceValue) {
      case Source.BTG:
        return 'BTG';
      case Source.NUBANK:
        return 'NUBANK';
      default:
        return 'Unknown';
    }
  }

  loadSourceAccounts(): void {
    this.sourceAccountService.getSourceAccounts().subscribe({
      next: (accounts) => {
        this.sourceAccounts.set(accounts);
      },
      error: (error) => {
        this.errorHandler.showErrorToast(error, 'Error Loading Accounts', 'Failed to load source accounts.');
      }
    });
  }

  onSubmit(): void {
    if (this.sourceForm.invalid) {
      this.sourceForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.backendErrors.set({});

    const { name, source } = this.sourceForm.value;

    this.sourceAccountService.createSourceAccount(name, source).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Account Created',
          detail: 'Source account created successfully!',
          life: 3000
        });
        this.sourceForm.reset();
        this.backendErrors.set({});
        this.loadSourceAccounts();
      },
      error: (error) => {
        this.isLoading.set(false);
        
        // Extract field-specific validation errors
        const fieldErrors = this.errorHandler.getFieldErrors(error);
        this.backendErrors.set(fieldErrors);
        
        // Show error toast
        this.errorHandler.showErrorToast(error, 'Creation Failed', 'An error occurred while creating the source account.');
      }
    });
  }
}
