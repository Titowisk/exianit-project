import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Month } from '../../models/enums/month.enum';
import { MonthlyExpensesByCategory } from '../../models/monthly-expenses-by-category.interface';

@Component({
  selector: 'app-analytics',
  imports: [ChartModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  monthlyExpenses: MonthlyExpensesByCategory[] = [
      {
        month: Month.January,
        houseTotal: 1200.50,
        foodTotal: 450.75,
        groceriesTotal: 320.25,
        healthTotal: 180.00,
        shopTotal: 275.60,
        leisureTotal: 220.30,
        donationsTotal: 150.00,
        transportTotal: 340.80,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4287.45
      },
      {
        month: Month.February,
        houseTotal: 1200.50,
        foodTotal: 380.90,
        groceriesTotal: 295.75,
        healthTotal: 220.50,
        shopTotal: 150.30,
        leisureTotal: 180.45,
        donationsTotal: 150.00,
        transportTotal: 310.25,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4037.90
      },
      {
        month: Month.March,
        houseTotal: 1200.50,
        foodTotal: 425.80,
        groceriesTotal: 340.60,
        healthTotal: 165.75,
        shopTotal: 320.45,
        leisureTotal: 260.80,
        donationsTotal: 150.00,
        transportTotal: 355.90,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4369.05
      },
      {
        month: Month.April,
        houseTotal: 1200.50,
        foodTotal: 470.25,
        groceriesTotal: 315.85,
        healthTotal: 190.30,
        shopTotal: 280.70,
        leisureTotal: 340.55,
        donationsTotal: 150.00,
        transportTotal: 325.40,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4422.80
      },
      {
        month: Month.May,
        houseTotal: 1200.50,
        foodTotal: 510.60,
        groceriesTotal: 365.20,
        healthTotal: 175.85,
        shopTotal: 390.25,
        leisureTotal: 420.70,
        donationsTotal: 150.00,
        transportTotal: 380.45,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4742.80
      },
      {
        month: Month.June,
        houseTotal: 1200.50,
        foodTotal: 485.90,
        groceriesTotal: 355.45,
        healthTotal: 140.20,
        shopTotal: 450.80,
        leisureTotal: 380.65,
        donationsTotal: 150.00,
        transportTotal: 395.75,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4708.50
      },
      {
        month: Month.July,
        houseTotal: 1200.50,
        foodTotal: 520.40,
        groceriesTotal: 385.90,
        healthTotal: 155.60,
        shopTotal: 380.95,
        leisureTotal: 460.25,
        donationsTotal: 150.00,
        transportTotal: 420.85,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4823.70
      },
      {
        month: Month.August,
        houseTotal: 1200.50,
        foodTotal: 495.75,
        groceriesTotal: 375.30,
        healthTotal: 185.45,
        shopTotal: 340.60,
        leisureTotal: 425.90,
        donationsTotal: 150.00,
        transportTotal: 365.20,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4687.95
      },
      {
        month: Month.September,
        houseTotal: 1200.50,
        foodTotal: 440.85,
        groceriesTotal: 325.75,
        healthTotal: 210.90,
        shopTotal: 295.40,
        leisureTotal: 315.55,
        donationsTotal: 150.00,
        transportTotal: 345.65,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4433.85
      },
      {
        month: Month.October,
        houseTotal: 1200.50,
        foodTotal: 465.20,
        groceriesTotal: 340.85,
        healthTotal: 195.75,
        shopTotal: 420.30,
        leisureTotal: 285.45,
        donationsTotal: 150.00,
        transportTotal: 370.90,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4578.20
      },
      {
        month: Month.November,
        houseTotal: 1200.50,
        foodTotal: 415.60,
        groceriesTotal: 310.40,
        healthTotal: 225.85,
        shopTotal: 380.75,
        leisureTotal: 195.30,
        donationsTotal: 150.00,
        transportTotal: 330.55,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 4358.20
      },
      {
        month: Month.December,
        houseTotal: 1200.50,
        foodTotal: 540.90,
        groceriesTotal: 395.65,
        healthTotal: 170.40,
        shopTotal: 650.85,
        leisureTotal: 485.70,
        donationsTotal: 300.00,
        transportTotal: 410.25,
        educationTotal: 200.00,
        taxAndTributesTotal: 450.25,
        investmentsTotal: 500.00,
        totalMonth: 5303.50
      }
    ];

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
