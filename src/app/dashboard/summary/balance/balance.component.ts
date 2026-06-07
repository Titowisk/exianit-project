import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DecimalPipe } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { MonthlyBalance, BalanceSummaryTotals } from '../../../models/monthly-balance.interface';
import { YearService } from '../../../header/year.service';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { CATEGORY_COLORS } from '../../../helpers/category-colors.helper';
import { Category } from '../../../models/enums/category.enum';

@Component({
  selector: 'app-balance',
  imports: [TableModule, ProgressSpinnerModule, DecimalPipe],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceComponent {
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private errorHandler = inject(ErrorHandlerService);
  yearService = inject(YearService);

  monthlyBalances = signal<MonthlyBalance[]>([]);
  averages = signal<BalanceSummaryTotals | null>(null);
  totals = signal<BalanceSummaryTotals | null>(null);
  isLoading = signal<boolean>(false);

  readonly colors = CATEGORY_COLORS;
  readonly Category = Category;

  readonly totalCostColor = '#c0392b';

  constructor() {
    effect(() => {
      const yearItem = this.yearService.selectedYear();
      this.loadBalance(yearItem.year);
    });
  }

  private loadBalance(year: number): void {
    const userId = this.authService.userId();
    if (!userId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not authenticated',
      });
      return;
    }

    this.isLoading.set(true);
    this.transactionService.getBalanceSummary(userId, year).subscribe({
      next: (response) => {
        this.monthlyBalances.set(response.monthlyBalances);
        this.averages.set(response.averages);
        this.totals.set(response.totals);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorHandler.showErrorToast(error, 'Error', 'Failed to load balance summary');
        this.isLoading.set(false);
      },
    });
  }
}
