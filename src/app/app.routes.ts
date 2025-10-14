import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { StatementComponent } from './dashboard/statement/statement.component';
import { SummaryComponent } from './dashboard/summary/summary.component';
import { AnalyticsComponent } from './dashboard/analytics/analytics.component';



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
  { path: 'statement', component: StatementComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'users', component: UsersComponent },
];
