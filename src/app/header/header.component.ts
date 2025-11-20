import { Component, signal, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Button } from 'primeng/button';
import { YearItem } from '../models/year-item.interface';
import { Select } from 'primeng/select';
import { YearService } from './year.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, MenuModule, Button, Select, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  yearService = inject(YearService);

  toggleDarkMode() {
    const element = document.querySelector('html');
    element!.classList.toggle('my-app-dark');
  }

  // Navigation items using PrimeNG MenuItem interface
  navItems = signal<MenuItem[]>([
    {
      label: 'Imports',
      icon: 'pi pi-file-import',
      command: () => this.navigateTo('/dashboard'),
      routerLink: '/dashboard',
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
  profileItem = signal<MenuItem[]>([
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.navigateTo('/dashboard'),
      routerLink: '/dashboard',
    },
  ]);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  selectYearItem = signal<YearItem[]>(this.yearService.getYears());
  selectedYearValue: YearItem = this.yearService.selectedYear();
  
  onYearChange(event: any) {
    const selectedYear = event.value;
    this.yearService.setSelectedYear(selectedYear);
    this.selectedYearValue = selectedYear;
  }
}
