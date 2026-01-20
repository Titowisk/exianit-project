import { Component, signal, computed, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { BankAccountService } from '../../services/bank-account.service';
import { BankAccount } from '../../models/bank-account.interface';
import { getBankStatementTypeOptions } from '../../helpers/bank-statement-type.helper';

@Component({
  selector: 'app-import',
  imports: [CommonModule, ReactiveFormsModule, Select, Button, Message, FileUpload, RouterLink],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bankAccountService = inject(BankAccountService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  bankAccounts = signal<BankAccount[]>([]);
  selectedFile = signal<File | null>(null);
  isUploading = signal(false);
  isLoadingAccounts = signal(true);

  hasBankAccounts = computed(() => this.bankAccounts().length > 0);

  importForm: FormGroup;
  statementTypeOptions = getBankStatementTypeOptions();

  private readonly MAX_FILE_SIZE = 5242880; // 5MB in bytes

  constructor() {
    this.importForm = this.fb.group({
      bankAccountId: ['', [Validators.required]],
      statementType: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadBankAccounts();
  }

  private loadBankAccounts(): void {
    this.isLoadingAccounts.set(true);
    this.bankAccountService.getBankAccounts().subscribe({
      next: (accounts) => {
        this.bankAccounts.set(accounts);
        this.isLoadingAccounts.set(false);
      },
      error: (error) => {
        this.isLoadingAccounts.set(false);
        const errorMessage = error?.error?.message || error?.message || 'Failed to load bank accounts. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 5000
        });
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

    const { bankAccountId, statementType } = this.importForm.value;
    const file = this.selectedFile()!;

    this.bankAccountService.uploadStatement(bankAccountId, statementType, file).subscribe({
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
        const errorMessage = error?.error?.message || error?.message || 'Failed to import statement. Please try again.';
        this.messageService.add({
          severity: 'error',
          summary: 'Import Failed',
          detail: errorMessage,
          life: 5000
        });
      }
    });
  }

  private resetForm(): void {
    this.importForm.reset();
    this.selectedFile.set(null);
  }
}
