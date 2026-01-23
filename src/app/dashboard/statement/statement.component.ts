import { Component, inject, signal } from '@angular/core';
import { StatementService } from '../statement.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  yearService = inject(YearService);

  statements = signal<StatementTransaction[]>([]);
  isLoading = signal<boolean>(false);
  editingId = signal<string | null>(null);
  editingCategory = signal<string>('');

  constructor() {
    this.loadStatements();
  }

  private loadStatements(): void {
    this.isLoading.set(true);
    this.statementService.getAllStatements().subscribe({
      next: (data) => {
        this.statements.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getCategoryOptions(statement: StatementTransaction): { label: string; value: string }[] {
    if (statement.type === 'expense') {
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

  startEdit(statement: StatementTransaction): void {
    this.editingId.set(statement.id);
    this.editingCategory.set(statement.category);
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editingCategory.set('');
  }

  saveCategory(id: string): void {
    // TODO: Implement API call to update category
    console.log(`Saving category for transaction ${id}: ${this.editingCategory()}`);
    this.cancelEdit();
  }
}
