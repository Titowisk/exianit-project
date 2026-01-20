import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { StatementComponent } from './dashboard/statement/statement.component';
import { AnalyticsComponent } from './dashboard/analytics/analytics.component';
import { ExpensesComponent } from './dashboard/summary/expenses/expenses.component';
import { IncomesComponent } from './dashboard/summary/incomes/incomes.component';
import { LoginComponent } from './dashboard/login/login.component';
import { RegisterComponent } from './dashboard/register/register.component';
import { ImportComponent } from './dashboard/import/import.component';
import { BankAccountComponent } from './dashboard/bank-account/bank-account.component';



@Component({
  template: `
    <div class="page-container">
      <h1 class="page-title">Users</h1>
      <p class="page-subtitle">Manage application users</p>
      <div>
        <p>User management interface would be displayed here.</p>
      </div>
    </div>
  `
})
export class UsersComponent { }


export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'import', component: ImportComponent },
  { path: 'statement', component: StatementComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'incomes', component: IncomesComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'bank-account', component: BankAccountComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
