import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomesComponent } from './incomes/incomes.component';

@Component({
  selector: 'app-summary',
  imports: [ExpensesComponent, IncomesComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {}
