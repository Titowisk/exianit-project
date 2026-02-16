import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ProblemDetails } from '../models/problem-details.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private messageService = inject(MessageService);

  /**
   * Parse HttpErrorResponse and extract ProblemDetails
   */
  parseProblemDetails(error: HttpErrorResponse): ProblemDetails | null {
    if (error.error && typeof error.error === 'object') {
      const problemDetails = error.error as ProblemDetails;
      
      // Validate that it looks like a Problem Details response
      if (problemDetails.title || problemDetails.detail) {
        return problemDetails;
      }
    }
    return null;
  }

  /**
   * Extract a user-friendly error message from ProblemDetails
   */
  getErrorMessage(error: HttpErrorResponse, fallbackMessage: string = 'An error occurred. Please try again.'): string {
    const problemDetails = this.parseProblemDetails(error);
    
    if (problemDetails) {
      return problemDetails.detail || problemDetails.title || fallbackMessage;
    }
    
    return error.message || fallbackMessage;
  }

  /**
   * Get field-specific validation errors from ProblemDetails
   */
  getFieldErrors(error: HttpErrorResponse): Record<string, string[]> {
    const problemDetails = this.parseProblemDetails(error);
    
    if (problemDetails?.errors) {
      return problemDetails.errors;
    }
    
    return {};
  }

  /**
   * Display error message as toast notification
   */
  showErrorToast(error: HttpErrorResponse, summary: string = 'Error', fallbackMessage?: string): void {
    const detail = this.getErrorMessage(error, fallbackMessage);
    
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }

  /**
   * Check if error response has validation errors
   */
  hasValidationErrors(error: HttpErrorResponse): boolean {
    const problemDetails = this.parseProblemDetails(error);
    return !!(problemDetails?.errors && Object.keys(problemDetails.errors).length > 0);
  }
}
