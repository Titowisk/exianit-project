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
      label: 'Dashboard', 
      icon: '🏠',
      command: () => this.navigateTo('/dashboard'),
      routerLink: '/dashboard'
    },
    { 
      label: 'Analytics', 
      icon: '📊',
      command: () => this.navigateTo('/analytics'),
      routerLink: '/analytics'
    },
    { 
      label: 'Users', 
      icon: '👥',
      command: () => this.navigateTo('/users'),
      routerLink: '/users'
    },
    { 
      label: 'Settings', 
      icon: '⚙️',
      command: () => this.navigateTo('/settings'),
      routerLink: '/settings'
    },
    { 
      label: 'Reports', 
      icon: '📝',
      command: () => this.navigateTo('/reports'),
      routerLink: '/reports'
    },
    { 
      label: 'Messages', 
      icon: '💬',
      command: () => this.navigateTo('/messages'),
      routerLink: '/messages'
    },
    { 
      label: 'Notifications', 
      icon: '🔔',
      command: () => this.navigateTo('/notifications'),
      routerLink: '/notifications'
    }
  ]);

  // Profile menu item
  profileItem = signal<MenuItem[]>([
    {
      label: 'Profile',
      icon: 'pi-user',
      command: () => this.navigateTo('/profile'),
      routerLink: '/profile'
    }
  ]);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
