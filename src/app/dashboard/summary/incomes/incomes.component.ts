import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { TableModule } from "primeng/table";
import { MonthlyIncomesByCategory } from '../../../models/monthly-incomes-by-category.interface';
import { YearService } from '../../../header/year.service';
import { TransactionService, IncomeSummaryTotals } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { INCOMES_COLORS_DICT } from '../../../helpers/incomes-category-colors.helper';
import { IncomesCategory } from '../../../models/enums/incomes-category.enum';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-incomes',
  imports: [TableModule, ProgressSpinnerModule, DecimalPipe],
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncomesComponent {
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  yearService = inject(YearService);

  monthlyIncomes = signal<MonthlyIncomesByCategory[]>([]);
  averages = signal<IncomeSummaryTotals | null>(null);
  totals = signal<IncomeSummaryTotals | null>(null);
  isLoading = signal<boolean>(false);

  // Expose colors for template
  readonly colors = INCOMES_COLORS_DICT;
  readonly IncomesCategory = IncomesCategory;

  constructor() {
    // Watch for year changes and reload data
    effect(() => {
      const yearItem = this.yearService.selectedYear();
      this.loadIncomes(yearItem.year);
    });
  }

  private loadIncomes(year: number): void {
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
    this.transactionService.getIncomeSummary(userId, year).subscribe({
      next: (response) => {
        this.monthlyIncomes.set(response.monthlyIncomes);
        this.averages.set(response.averages);
        this.totals.set(response.totals);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading income summary:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message || 'Failed to load income summary'
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
