import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { StatementComponent } from './dashboard/statement/statement.component';

// Simple placeholder components for demonstration
@Component({
  template: `
    <div class="page-container">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Welcome to your dashboard overview</p>
      <div>
        <p>This is the main dashboard where you can see an overview of your application.</p>
      </div>
    </div>
  `
})
export class DashboardComponent { }

@Component({
  template: `
    <div class="page-container">
      <h1 class="page-title">Analytics</h1>
      <p class="page-subtitle">View your application analytics and metrics</p>
      <div>
        <p>Analytics and reporting data would be displayed here.</p>
      </div>
    </div>
  `
})
export class AnalyticsComponent { }

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

@Component({
  template: `
    <div class="page-container">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Configure your application settings</p>
      <div>
        <p>Application settings and configuration options would be displayed here.</p>
      </div>
    </div>
  `
})
export class SettingsComponent { }

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'statement', component: StatementComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'reports', component: DashboardComponent }, // Reusing for demo
  { path: 'messages', component: DashboardComponent }, // Reusing for demo  
  { path: 'notifications', component: DashboardComponent }, // Reusing for demo
  { path: 'profile', component: SettingsComponent }, // Reusing for demo
];
