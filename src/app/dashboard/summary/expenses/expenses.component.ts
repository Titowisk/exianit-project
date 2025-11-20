import { Component, inject } from '@angular/core';
import { MonthlyExpensesByCategory } from '../../../models/monthly-expenses-by-category.interface';
import { TableModule } from "primeng/table";
import { CommonModule } from '@angular/common';
import { MONTHLY_EXPENSES_DATA } from '../../../data/monthly-expenses.data';
import { YearService } from '../../../header/year.service';

@Component({
  selector: 'app-expenses',
  imports: [TableModule, CommonModule],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})

export class ExpensesComponent {
  monthlyExpenses: MonthlyExpensesByCategory[] = MONTHLY_EXPENSES_DATA;
  yearService = inject(YearService);
}
