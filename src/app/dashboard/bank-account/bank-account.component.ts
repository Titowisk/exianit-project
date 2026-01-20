import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bank-account',
  imports: [CommonModule],
  template: `
    <div class="bank-account-container">
      <div class="bank-account-card">
        <h1>Bank Account Management</h1>
        <p class="subtitle">Coming Soon</p>
        <p class="description">
          This feature is currently under development. You will soon be able to manage your bank accounts here.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .bank-account-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 1rem;
    }

    .bank-account-card {
      width: 100%;
      max-width: 500px;
      padding: 2rem;
      background: var(--surface-card);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      
      h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }
      
      .subtitle {
        color: var(--primary-color);
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .description {
        color: var(--text-color-secondary);
        line-height: 1.6;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankAccountComponent {}
