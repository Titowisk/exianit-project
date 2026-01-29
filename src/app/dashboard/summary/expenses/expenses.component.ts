import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MonthlyExpensesByCategory, ExpensesSummaryTotals } from '../../../models/monthly-expenses-by-category.interface';
import { TableModule } from "primeng/table";
import { CommonModule } from '@angular/common';
import { YearService } from '../../../header/year.service';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { EXPENSES_COLORS_DICT } from '../../../helpers/expenses-category-colors.helper';
import { ExpensesCategory } from '../../../models/enums/expenses-category.enum';

@Component({
  selector: 'app-expenses',
  imports: [TableModule, CommonModule, ProgressSpinnerModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ExpensesComponent {
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  yearService = inject(YearService);

  monthlyExpenses = signal<MonthlyExpensesByCategory[]>([]);
  averages = signal<ExpensesSummaryTotals | null>(null);
  totals = signal<ExpensesSummaryTotals | null>(null);
  isLoading = signal<boolean>(false);

  // Expose colors for template
  readonly colors = EXPENSES_COLORS_DICT;
  readonly ExpensesCategory = ExpensesCategory;

  constructor() {
    // Watch for year changes and reload data
    effect(() => {
      const yearItem = this.yearService.selectedYear();
      this.loadExpenses(yearItem.year);
    });
  }

  private loadExpenses(year: number): void {
    const userId = this.authService.userId();
    if (!userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not authenticated'
      });
      return;
    }

    this.isLoading.set(true);
    this.transactionService.getExpenseSummary(userId, year).subscribe({
      next: (response) => {
        this.monthlyExpenses.set(response.monthlyExpenses);
        this.averages.set(response.averages);
        this.totals.set(response.totals);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading expense summary:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load expense summary'
        });
        this.isLoading.set(false);
      }
    });
  }

  hexToRgba(hex: string, alpha: number): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
