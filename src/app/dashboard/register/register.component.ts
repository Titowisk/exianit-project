import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, InputText, Password, Button, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  isLoading = signal(false);
  backendErrors = signal<Record<string, string[]>>({});

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Clear backend errors when form values change
    this.registerForm.valueChanges.subscribe(() => {
      const currentErrors = this.backendErrors();
      const clearedErrors: Record<string, string[]> = {};
      
      // Keep errors for fields that haven't changed
      Object.keys(currentErrors).forEach(field => {
        if (this.registerForm.get(field)?.pristine) {
          clearedErrors[field] = currentErrors[field];
        }
      });
      
      this.backendErrors.set(clearedErrors);
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }

  hasUpperCase(): boolean {
    return !!(this.password?.value && /[A-Z]/.test(this.password.value));
  }

  hasLowerCase(): boolean {
    return !!(this.password?.value && /[a-z]/.test(this.password.value));
  }

  hasDigit(): boolean {
    return !!(this.password?.value && /\d/.test(this.password.value));
  }

  hasSpecialChar(): boolean {
    return !!(this.password?.value && /[@$!%*?&]/.test(this.password.value));
  }

  getBackendErrors(field: string): string[] {
    return this.backendErrors()[field] || [];
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.backendErrors.set({});

    const { email, password } = this.registerForm.value;

    this.authService.signUp(email, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.registerForm.reset();
        this.backendErrors.set({});
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading.set(false);
        
        // Extract field-specific validation errors
        const fieldErrors = this.errorHandler.getFieldErrors(error);
        this.backendErrors.set(fieldErrors);
        
        // Show error toast
        this.errorHandler.showErrorToast(error, 'Sign Up Failed', 'An error occurred during sign up. Please try again.');
      }
    });
  }
}
