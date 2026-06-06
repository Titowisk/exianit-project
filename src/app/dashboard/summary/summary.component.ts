import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomesComponent } from './incomes/incomes.component';
import { BalanceComponent } from './balance/balance.component';

@Component({
  selector: 'app-summary',
  imports: [ExpensesComponent, IncomesComponent, BalanceComponent],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {}
