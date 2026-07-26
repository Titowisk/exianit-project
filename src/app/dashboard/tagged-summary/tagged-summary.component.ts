import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { forkJoin } from 'rxjs';
import { YearService } from '../../header/year.service';
import { TransactionService } from '../../services/transaction.service';
import { TagService } from '../../services/tag.service';
import { AuthService } from '../../services/auth.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Tag } from '../../models/tag.interface';
import { Transaction } from '../../models/transaction.interface';

interface TaggedMonthRow {
  month: string;
  totals: Record<string, number>;
  total: number;
}

interface TaggedSummaryAggregates {
  totals: Record<string, number>;
  total: number;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

@Component({
  selector: 'app-tagged-summary',
  imports: [CommonModule, TableModule, ProgressSpinner],
  templateUrl: './tagged-summary.component.html',
  styleUrl: './tagged-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaggedSummaryComponent {
  private transactionService = inject(TransactionService);
  private tagService = inject(TagService);
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlerService);
  yearService = inject(YearService);

  userTags = signal<Tag[]>([]);
  monthRows = signal<TaggedMonthRow[]>([]);
  averages = signal<TaggedSummaryAggregates | null>(null);
  totals = signal<TaggedSummaryAggregates | null>(null);
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
      tags: this.tagService.getTags(),
      transactions: this.transactionService.getUserTransactionsByYear(year)
    }).subscribe({
      next: ({ tags, transactions }) => {
        this.userTags.set(tags);
        this.buildSummary(transactions, tags);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorHandler.showErrorToast(error, 'Error', 'Failed to load tagged summary.');
      }
    });
  }

  private buildSummary(transactions: Transaction[], tags: Tag[]): void {
    const tagged = transactions.filter(t => t.tag != null);

    const rows: TaggedMonthRow[] = MONTH_NAMES.map((month, monthIndex) => {
      const monthTx = tagged.filter(t => t.date.getMonth() === monthIndex);

      const tagTotals: Record<string, number> = {};
      for (const tag of tags) {
        tagTotals[tag.id] = monthTx
          .filter(t => t.tag?.id === tag.id)
          .reduce((sum, t) => sum + t.amount, 0);
      }

      const total = Object.values(tagTotals).reduce((sum, v) => sum + v, 0);
      return { month, totals: tagTotals, total };
    }).filter(row => row.total > 0);

    this.monthRows.set(rows);

    if (rows.length === 0) {
      this.averages.set(null);
      this.totals.set(null);
      return;
    }

    const n = rows.length;
    const aggTotals: Record<string, number> = {};
    let grandTotal = 0;

    for (const tag of tags) {
      aggTotals[tag.id] = rows.reduce((sum, row) => sum + (row.totals[tag.id] ?? 0), 0);
      grandTotal += aggTotals[tag.id];
    }

    const aggAverages: Record<string, number> = {};
    for (const tag of tags) {
      aggAverages[tag.id] = aggTotals[tag.id] / n;
    }

    this.totals.set({ totals: aggTotals, total: grandTotal });
    this.averages.set({ totals: aggAverages, total: grandTotal / n });
  }
}
