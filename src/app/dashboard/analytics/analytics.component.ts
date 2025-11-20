import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Month } from '../../models/enums/month.enum';
import { MonthlyExpensesByCategory } from '../../models/monthly-expenses-by-category.interface';
import { MONTHLY_EXPENSES_DATA } from '../../data/monthly-expenses.data';

@Component({
  selector: 'app-analytics',
  imports: [ChartModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  monthlyExpenses: MonthlyExpensesByCategory[] = MONTHLY_EXPENSES_DATA;

  data = {
    labels: this.monthlyExpenses.map(expense => Month[expense.month]),
    datasets: [
      {
        type: 'bar',
        label: 'House',
        backgroundColor: '#42A5F5',
        data: this.monthlyExpenses.map(expense => expense.houseTotal),
      },
      {
        type: 'bar',
        label: 'Food',
        backgroundColor: '#66BB6A',
        data: this.monthlyExpenses.map(expense => expense.foodTotal),
      },
      {
        type: 'bar',
        label: 'Groceries',
        backgroundColor: '#FFA726',
        data: this.monthlyExpenses.map(expense => expense.groceriesTotal),
      },
      {
        type: 'bar',
        label: 'Health',
        backgroundColor: '#EF5350',
        data: this.monthlyExpenses.map(expense => expense.healthTotal),
      },
      {
        type: 'bar',
        label: 'Shop',
        backgroundColor: '#AB47BC',
        data: this.monthlyExpenses.map(expense => expense.shopTotal),
      },
      {
        type: 'bar',
        label: 'Leisure',
        backgroundColor: '#26A69A',
        data: this.monthlyExpenses.map(expense => expense.leisureTotal),
      },
      {
        type: 'bar',
        label: 'Donations',
        backgroundColor: '#FFCA28',
        data: this.monthlyExpenses.map(expense => expense.donationsTotal),
      },
      {
        type: 'bar',
        label: 'Transport',
        backgroundColor: '#78909C',
        data: this.monthlyExpenses.map(expense => expense.transportTotal),
      },
      {
        type: 'bar',
        label: 'Education',
        backgroundColor: '#8D6E63',
        data: this.monthlyExpenses.map(expense => expense.educationTotal),
      },
      {
        type: 'bar',
        label: 'Tax & Tributes',
        backgroundColor: '#FF7043',
        data: this.monthlyExpenses.map(expense => expense.taxAndTributesTotal),
      },
      {
        type: 'bar',
        label: 'Investments',
        backgroundColor: '#29B6F6',
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
