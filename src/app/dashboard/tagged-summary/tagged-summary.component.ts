import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { forkJoin } from 'rxjs';
import { YearService } from '../../header/year.service';
import { TagService } from '../../services/tag.service';
import { AuthService } from '../../services/auth.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { TaggedSummaryResponse } from '../../models/tagged-summary.interface';

@Component({
  selector: 'app-tagged-summary',
  imports: [CommonModule, TableModule, ProgressSpinner],
  templateUrl: './tagged-summary.component.html',
  styleUrl: './tagged-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaggedSummaryComponent {
  private tagService = inject(TagService);
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);
  yearService = inject(YearService);

  expenseSummary = signal<TaggedSummaryResponse | null>(null);
  incomeSummary = signal<TaggedSummaryResponse | null>(null);
  isLoading = signal<boolean>(false);
  currentYearText = computed(() => `${this.yearService.selectedYear().year}`);

  constructor() {
    effect(() => {
      const yearItem = this.yearService.selectedYear();
      this.loadData(yearItem.year);
    });
  }

  private loadData(year: number): void {
    const userId = this.authService.userId();
    if (!userId) return;

    this.isLoading.set(true);

    forkJoin({
      expenses: this.tagService.getTaggedExpenseSummary(year),
      incomes: this.tagService.getTaggedIncomeSummary(year)
    }).subscribe({
      next: ({ expenses, incomes }) => {
        this.expenseSummary.set(expenses);
        this.incomeSummary.set(incomes);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorHandler.showErrorToast(error, 'Error', 'Failed to load tagged summary.');
      }
    });
  }
}
