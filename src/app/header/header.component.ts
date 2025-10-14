import { Component, signal, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  
  // Navigation items using PrimeNG MenuItem interface
  navItems = signal<MenuItem[]>([
    { 
      label: 'Imports', 
      icon: 'pi pi-file-import',
      command: () => this.navigateTo('/dashboard'),
      routerLink: '/dashboard'
    },
    { 
      label: 'Statement', 
      icon: 'pi pi-receipt',
      command: () => this.navigateTo('/statement'),
      routerLink: '/statement'
    },
    { 
      label: 'Summaries', 
      icon: 'pi pi-table',
      command: () => this.navigateTo('/dashboard'),
      routerLink: '/dashboard'
    },
    { 
      label: 'Monthly', 
      icon: 'pi pi-chart-bar',
      command: () => this.navigateTo('/dashboard'),
      routerLink: '/dashboard'
    },
    { 
      label: 'Predictions', 
      icon: 'pi pi-calendar-clock',
      command: () => this.navigateTo('/dashboard'),
      routerLink: '/dashboard'
    },
    { 
      label: 'Notifications', 
      icon: 'pi pi-bell',
      command: () => this.navigateTo('/notifications'),
      routerLink: '/notifications'
    }
  ]);

  // Profile menu item
  profileItem = signal<MenuItem[]>([
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.navigateTo('/profile'),
      routerLink: '/profile'
    }
  ]);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
