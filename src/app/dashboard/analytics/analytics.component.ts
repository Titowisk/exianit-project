import { Component, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Month } from '../../models/enums/month.enum';
import { MonthlyExpensesByCategory } from '../../models/monthly-expenses-by-category.interface';
import { MONTHLY_EXPENSES_DATA } from '../../data/monthly-expenses.data';
import { YearService } from '../../header/year.service';
import { EXPENSES_ANALYTICS_DICT } from '../../helpers/expenses-category-colors.helper';
import { ExpensesCategory } from '../../models/enums/expenses-category.enum';

@Component({
  selector: 'app-analytics',
  imports: [ChartModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  monthlyExpenses: MonthlyExpensesByCategory[] = MONTHLY_EXPENSES_DATA;
  yearService = inject(YearService);

  data = {
    labels: this.monthlyExpenses.map(expense => expense.month),
    datasets: [
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.House].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.House].color,
        data: this.monthlyExpenses.map(expense => expense.houseTotal),
      },
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Food].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Food].color,
        data: this.monthlyExpenses.map(expense => expense.foodTotal),
      },
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Groceries].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Groceries].color,
        data: this.monthlyExpenses.map(expense => expense.groceriesTotal),
      },
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Health].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Health].color,
        data: this.monthlyExpenses.map(expense => expense.healthTotal),
      },
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Shop].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Shop].color,
        data: this.monthlyExpenses.map(expense => expense.shopTotal),
      },
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Leisure].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Leisure].color,
        data: this.monthlyExpenses.map(expense => expense.leisureTotal),
      },
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Donations].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Donations].color,
        data: this.monthlyExpenses.map(expense => expense.donationsTotal),
      },
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Transport].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Transport].color,
        data: this.monthlyExpenses.map(expense => expense.transportTotal),
      },
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Education].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Education].color,
        data: this.monthlyExpenses.map(expense => expense.educationTotal),
      },
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.TaxAndTributes].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.TaxAndTributes].color,
        data: this.monthlyExpenses.map(expense => expense.taxAndTributesTotal),
      },
      {
        type: 'bar',
        label: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Investments].label,
        backgroundColor: EXPENSES_ANALYTICS_DICT[ExpensesCategory.Investments].color,
        data: this.monthlyExpenses.map(expense => expense.investmentsTotal),
      },
    ],
  };

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
}
