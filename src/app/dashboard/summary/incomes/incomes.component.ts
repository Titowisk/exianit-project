import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TableModule } from "primeng/table";
import { MonthlyIncomesByCategory } from '../../../models/monthly-incomes-by-category.interface';
import { MONTHLY_INCOMES_DATA } from '../../../data/monthly-incomes.data';
import { YearService } from '../../../header/year.service';

@Component({
  selector: 'app-incomes',
  imports: [TableModule, CommonModule],
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.scss'
})
export class IncomesComponent {
  monthlyIncomes: MonthlyIncomesByCategory[] = MONTHLY_INCOMES_DATA;
  yearService = inject(YearService);
}
