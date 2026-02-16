import { Component, signal, inject, computed, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Button } from 'primeng/button';
import { YearItem } from '../models/year-item.interface';
import { Select } from 'primeng/select';
import { YearService } from './year.service';
import { AuthService } from '../services/auth.service';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, MenuModule, Button, Select, FormsModule, ProgressSpinner],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  yearService = inject(YearService);

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor() {
    // Watch for authentication changes and load years when user logs in
    effect(() => {
      if (this.isAuthenticated()) {
        this.yearService.loadYears();
      }
    });
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element!.classList.toggle('my-app-dark');
  }

  // Navigation items using PrimeNG MenuItem interface
  navItems = signal<MenuItem[]>([
    {
      label: 'Imports',
      icon: 'pi pi-file-import',
      command: () => this.navigateTo('/import'),
      routerLink: '/import',
    },
    {
      label: 'Statement',
      icon: 'pi pi-receipt',
      command: () => this.navigateTo('/statement'),
      routerLink: '/statement',
    },
    {
      label: 'Expenses',
      icon: 'pi pi-table',
      command: () => this.navigateTo('/expenses'),
      routerLink: '/expenses',
    },
    {
      label: 'Incomes',
      icon: 'pi pi-table',
      command: () => this.navigateTo('/incomes'),
      routerLink: '/incomes',
    },
    {
      label: 'Analytics',
      icon: 'pi pi-chart-bar',
      command: () => this.navigateTo('/analytics'),
      routerLink: '/analytics',
    },
    {
      label: 'Predictions',
      icon: 'pi pi-calendar-clock',
      command: () => this.navigateTo('/dashboard'),
      routerLink: '/dashboard',
    },
    {
      label: 'Notifications',
      icon: 'pi pi-bell',
      command: () => this.navigateTo('/dashboard'),
      routerLink: '/dashboard',
    },
  ]);

  // Profile menu item
  userItems = signal<MenuItem[]>([
    {
      label: 'Bank Accounts',
      icon: 'pi pi-building-columns',
      command: () => this.navigateTo('/bank-account'),
      routerLink: '/bank-account',
    },
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.navigateTo('/dashboard'),
      routerLink: '/dashboard',
    },
    {
      label: 'Register',
      icon: 'pi pi-user-plus',
      command: () => this.navigateTo('/register'),
      routerLink: '/register',
    },
    {
      label: 'Login',
      icon: 'pi pi-sign-in',
      command: () => this.navigateTo('/login'),
      routerLink: '/login',
    },
  ]);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  selectedYearValue: YearItem = this.yearService.selectedYear();
  
  onYearChange(event: any) {
    const selectedYear = event.value;
    this.yearService.setSelectedYear(selectedYear);
    this.selectedYearValue = selectedYear;
  }

  retryLoadYears() {
    this.yearService.loadYears();
  }
}
