import { Component, computed, effect, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { MonthlyExpensesByCategory } from '../../models/monthly-expenses-by-category.interface';
import { YearService } from '../../header/year.service';
import { CATEGORY_COLORS } from '../../helpers/category-colors.helper';
import { Category } from '../../models/enums/category.enum';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-analytics',
  imports: [ChartModule, ProgressSpinnerModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  private transactionService = inject(TransactionService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  yearService = inject(YearService);

  monthlyExpenses = signal<MonthlyExpensesByCategory[]>([]);
  isLoading = signal<boolean>(false);

  data = computed(() => ({
    labels: this.monthlyExpenses().map(expense => expense.month),
    datasets: [
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.House].label,
        backgroundColor: CATEGORY_COLORS[Category.House].color,
        data: this.monthlyExpenses().map(expense => expense.houseTotal),
      },
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.Food].label,
        backgroundColor: CATEGORY_COLORS[Category.Food].color,
        data: this.monthlyExpenses().map(expense => expense.foodTotal),
      },
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.Groceries].label,
        backgroundColor: CATEGORY_COLORS[Category.Groceries].color,
        data: this.monthlyExpenses().map(expense => expense.groceriesTotal),
      },
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.Health].label,
        backgroundColor: CATEGORY_COLORS[Category.Health].color,
        data: this.monthlyExpenses().map(expense => expense.healthTotal),
      },
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.Shop].label,
        backgroundColor: CATEGORY_COLORS[Category.Shop].color,
        data: this.monthlyExpenses().map(expense => expense.shopTotal),
      },
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.Leisure].label,
        backgroundColor: CATEGORY_COLORS[Category.Leisure].color,
        data: this.monthlyExpenses().map(expense => expense.leisureTotal),
      },
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.Donations].label,
        backgroundColor: CATEGORY_COLORS[Category.Donations].color,
        data: this.monthlyExpenses().map(expense => expense.donationsTotal),
      },
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.Transport].label,
        backgroundColor: CATEGORY_COLORS[Category.Transport].color,
        data: this.monthlyExpenses().map(expense => expense.transportTotal),
      },
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.Education].label,
        backgroundColor: CATEGORY_COLORS[Category.Education].color,
        data: this.monthlyExpenses().map(expense => expense.educationTotal),
      },
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.TaxAndTributes].label,
        backgroundColor: CATEGORY_COLORS[Category.TaxAndTributes].color,
        data: this.monthlyExpenses().map(expense => expense.taxAndTributesTotal),
      },
      {
        type: 'bar',
        label: CATEGORY_COLORS[Category.Investments].label,
        backgroundColor: CATEGORY_COLORS[Category.Investments].color,
        data: this.monthlyExpenses().map(expense => expense.investmentsTotal),
      },
    ],
  }));

  options = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: '#6c757d',
        },
        grid: {
          color: '#dee2e6',
          drawBorder: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: '#6c757d',
        },
        grid: {
          color: '#dee2e6',
          drawBorder: false,
        },
      },
    },
  };

  constructor() {
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
}
