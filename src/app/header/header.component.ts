import { Component, signal, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  
  // Navigation items with icons
  navItems = signal<NavItem[]>([
    { icon: '🏠', label: 'Dashboard', route: '/dashboard' },
    { icon: '📊', label: 'Analytics', route: '/analytics' },
    { icon: '👥', label: 'Users', route: '/users' },
    { icon: '⚙️', label: 'Settings', route: '/settings' },
    { icon: '📝', label: 'Reports', route: '/reports' },
    { icon: '💬', label: 'Messages', route: '/messages' },
    { icon: '🔔', label: 'Notifications', route: '/notifications' }
  ]);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
