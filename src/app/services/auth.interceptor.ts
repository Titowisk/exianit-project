import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  // Only attach token if it's valid
  const token = authService.getToken();
  let clonedRequest = req;

  if (token && authService.isTokenValid()) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized and 403 Forbidden errors
      if (error.status === 401 || error.status === 403) {
        // Clear the invalid token
        authService.logout();

        // Show session expired message
        messageService.add({
          severity: 'error',
          summary: 'Session Expired',
          detail: 'Your session has expired. Please login again.',
          life: 5000
        });

        // Redirect to login page
        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};

