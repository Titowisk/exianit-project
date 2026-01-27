import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (authService.isTokenValid()) {
    return true;
  }

  // Token is invalid or expired - show message and redirect to login
  messageService.add({
    severity: 'warn',
    summary: 'Session Expired',
    detail: 'Your session has expired. Please login again.',
    life: 5000
  });

  // Redirect to login with return URL to redirect back after successful login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
