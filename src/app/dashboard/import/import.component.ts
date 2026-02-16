import { Component, signal, computed, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { SourceAccountService } from '../../services/source-account.service';
import { SourceAccount } from '../../models/source-account.interface';
import { getSourceStatementTypeOptions } from '../../helpers/source-statement-type.helper';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-import',
  imports: [CommonModule, ReactiveFormsModule, Select, Button, Message, FileUpload, RouterLink],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sourceAccountService = inject(SourceAccountService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  sourceAccounts = signal<SourceAccount[]>([]);
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  isLoadingAccounts = signal(true);
  backendErrors = signal<Record<string, string[]>>({});

  hasSourceAccounts = computed(() => this.sourceAccounts().length > 0);

  importForm: FormGroup;
  statementTypeOptions = getSourceStatementTypeOptions();

  private readonly MAX_FILE_SIZE = 5242880; // 5MB in bytes

  constructor() {
    this.importForm = this.fb.group({
      sourceAccountId: ['', [Validators.required]],
      statementType: [null, [Validators.required]]
    });

    // Clear backend errors when form values change
    this.importForm.valueChanges.subscribe(() => {
      const currentErrors = this.backendErrors();
      const clearedErrors: Record<string, string[]> = {};
      
      // Keep errors for fields that haven't changed
      Object.keys(currentErrors).forEach(field => {
        if (this.importForm.get(field)?.pristine) {
          clearedErrors[field] = currentErrors[field];
        }
      });
      
      this.backendErrors.set(clearedErrors);
    });
  }

  ngOnInit(): void {
    this.loadSourceAccounts();
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.importForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }

  getBackendErrors(field: string): string[] {
    return this.backendErrors()[field] || [];
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
        this.errorHandler.showErrorToast(error, 'Error', 'Failed to load source accounts. Please try again.');
      }
    });
  }

  onFileSelect(event: FileUploadHandlerEvent): void {
    const file = event.files[0];
    
    if (!file) {
      return;
    }

    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Too Large',
        detail: 'File size must not exceed 5MB.',
        life: 5000
      });
      this.selectedFile.set(null);
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File Type',
        detail: 'Only CSV files are allowed.',
        life: 5000
      });
      this.selectedFile.set(null);
      return;
    }

    this.selectedFile.set(file);
  }

  onSubmit(): void {
    if (this.importForm.invalid || !this.selectedFile()) {
      this.importForm.markAllAsTouched();
      return;
    }

    this.isUploading.set(true);
    this.backendErrors.set({});

    const { sourceAccountId, statementType } = this.importForm.value;
    const file = this.selectedFile()!;

    this.sourceAccountService.uploadStatement(sourceAccountId, statementType, file).subscribe({
      next: (response) => {
        this.isUploading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Import Successful',
          detail: response.message || 'Statement imported successfully.',
          life: 3000
        });
        this.resetForm();
      },
      error: (error) => {
        this.isUploading.set(false);
        
        // Extract field-specific validation errors
        const fieldErrors = this.errorHandler.getFieldErrors(error);
        this.backendErrors.set(fieldErrors);
        
        // Show error toast
        this.errorHandler.showErrorToast(error, 'Import Failed', 'Failed to import statement. Please try again.');
      }
    });
  }

  private resetForm(): void {
    this.importForm.reset();
    this.selectedFile.set(null);
    this.backendErrors.set({});
  }
}
