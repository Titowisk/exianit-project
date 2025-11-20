import { Component } from '@angular/core';
import { MonthlyExpensesByCategory } from '../../../models/monthly-expenses-by-category.interface';
import { TableModule } from "primeng/table";
import { CommonModule } from '@angular/common';
import { MONTHLY_EXPENSES_DATA } from '../../../data/monthly-expenses.data';

@Component({
  selector: 'app-expenses',
  imports: [TableModule, CommonModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})

export class ExpensesComponent {
  monthlyExpenses: MonthlyExpensesByCategory[] = MONTHLY_EXPENSES_DATA;
}
