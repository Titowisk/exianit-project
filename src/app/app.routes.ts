import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { StatementComponent } from './dashboard/statement/statement.component';
import { AnalyticsComponent } from './dashboard/analytics/analytics.component';
import { SummaryComponent } from './dashboard/summary/summary.component';
import { LoginComponent } from './dashboard/login/login.component';
import { RegisterComponent } from './dashboard/register/register.component';
import { ImportComponent } from './dashboard/import/import.component';
import { SourceAccountComponent } from './dashboard/source-account/source-account.component';
import { SourceStatementComponent } from './dashboard/source-statement/source-statement.component';
import { TagsComponent } from './dashboard/tags/tags.component';
import { authGuard } from './services/auth.guard';



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
  { path: 'import', component: ImportComponent, canActivate: [authGuard] },
  { path: 'statement', component: StatementComponent, canActivate: [authGuard] },
  { path: 'summary', component: SummaryComponent, canActivate: [authGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: 'source-account', component: SourceAccountComponent, canActivate: [authGuard] },
  { path: 'source-statement', component: SourceStatementComponent, canActivate: [authGuard] },
  { path: 'tags', component: TagsComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
