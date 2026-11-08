import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { of, Subject, throwError } from 'rxjs';
import { YearService } from '../../header/year.service';
import { Category } from '../../models/enums/category.enum';
import { Tag } from '../../models/tag.interface';
import { Transaction } from '../../models/transaction.interface';
import { AuthService } from '../../services/auth.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { SourceAccountService } from '../../services/source-account.service';
import { TagService } from '../../services/tag.service';
import { TransactionService } from '../../services/transaction.service';
import { StatementComponent } from './statement.component';

describe('StatementComponent tag actions', () => {
  const food: Tag = { id: 'food', name: 'Food', color: '#123456' };
  const travel: Tag = { id: 'travel', name: 'Travel', color: '#654321' };
  const makeTransactions = (count: number): Transaction[] => Array.from({ length: count }, (_, index) => ({
    id: String(index),
    type: 'expense',
    origin: `Shop ${String(index).padStart(2, '0')}`,
    amount: index + 1,
    date: new Date(2026, 0, 1),
    category: Category.Food,
    tag: food
  }));

  let fixture: ComponentFixture<StatementComponent>;
  let component: StatementComponent;
  let table: Table;
  let transactions: Transaction[];
  let selectedYear: ReturnType<typeof signal<{ year: number }>>;
  let transactionService: jasmine.SpyObj<TransactionService>;
  let tagService: jasmine.SpyObj<TagService>;
  let errorHandler: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(async () => {
    sessionStorage.removeItem('statement-table');
    transactions = makeTransactions(25);
    selectedYear = signal({ year: 2026 });
    transactionService = jasmine.createSpyObj<TransactionService>('TransactionService', ['getUserTransactionsByYear']);
    transactionService.getUserTransactionsByYear.and.returnValue(of(transactions));
    tagService = jasmine.createSpyObj<TagService>('TagService', [
      'getTags', 'tagTransaction', 'tagSimilarOriginTransactions'
    ]);
    tagService.getTags.and.returnValue(of([food, travel]));
    tagService.tagTransaction.and.returnValue(of(void 0));
    tagService.tagSimilarOriginTransactions.and.returnValue(of({ updatedCount: 1 }));
    errorHandler = jasmine.createSpyObj<ErrorHandlerService>('ErrorHandlerService', ['showErrorToast']);

    await TestBed.configureTestingModule({
      imports: [StatementComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideNoopAnimations(),
        MessageService,
        { provide: TransactionService, useValue: transactionService },
        { provide: TagService, useValue: tagService },
        { provide: ErrorHandlerService, useValue: errorHandler },
        { provide: AuthService, useValue: {} },
        { provide: SourceAccountService, useValue: {} },
        { provide: YearService, useValue: { selectedYear, selectedYearText: () => String(selectedYear().year) } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(StatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    table = fixture.debugElement.query(By.directive(Table)).componentInstance;
    table.filterDelay = 0;
  });

  afterEach(() => {
    sessionStorage.removeItem('statement-table');
  });

  async function filter(field: string, value: string): Promise<void> {
    table.filter(value, field, 'contains');
    await new Promise(resolve => setTimeout(resolve, 10));
    fixture.detectChanges();
  }

  function page(first: number): void {
    table.onPageChange({ first, rows: 10 });
    fixture.detectChanges();
  }

  async function render(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('preserves filters, sorting, page and session state when tagging one transaction', async () => {
    await filter('origin', 'Shop');
    table.sort({ field: 'origin', originalEvent: new MouseEvent('click') });
    page(10);
    component.selectedTagId.set(travel.id);
    component.saveTag(transactions[12]);
    await render();

    expect(table.first).toBe(10);
    expect(table.sortField).toBe('origin');
    expect(table.filters['origin']).toBeDefined();
    expect(component.transactions()[12].tag).toEqual(travel);
    expect(JSON.parse(sessionStorage.getItem('statement-table') ?? '{}').first).toBe(10);
  });

  it('reapplies tag filters and clamps the page when removing the final match on it', async () => {
    transactions = makeTransactions(11);
    component.transactions.set(transactions);
    await render();
    await filter('tag.name', 'Food');
    page(10);
    component.selectedTagId.set(null);
    component.saveTag(transactions[10]);
    await render();

    expect(tagService.tagTransaction).toHaveBeenCalledWith('10', null);
    expect(table.first).toBe(0);
    expect(table.filteredValue?.length).toBe(10);
    expect(table.filters['tag.name']).toBeDefined();
    expect(JSON.parse(sessionStorage.getItem('statement-table') ?? '{}').first).toBe(0);
  });

  it('uses the submitted tag and current page when a single tag request completes', async () => {
    await filter('origin', 'Shop');
    page(10);
    const request = new Subject<void>();
    tagService.tagTransaction.and.returnValue(request);
    component.selectedTagId.set(travel.id);
    component.saveTag(transactions[12]);
    component.selectedTagId.set(null);
    page(20);
    request.next();
    await render();

    expect(tagService.tagTransaction).toHaveBeenCalledWith('12', travel.id);
    expect(component.transactions()[12].tag).toEqual(travel);
    expect(table.first).toBe(20);
  });

  it('refreshes similar transactions without replacing the table or losing the latest page', async () => {
    await filter('tag.name', 'Food');
    page(10);
    const refresh = new Subject<Transaction[]>();
    transactionService.getUserTransactionsByYear.and.returnValue(refresh);
    component.selectedTagId.set(travel.id);
    component.saveSimilarOriginTag(transactions[12]);
    expect(component.isRefreshingTransactions()).toBeTrue();
    expect(component.isLoading()).toBeFalse();
    page(20);
    refresh.next(transactions.map(t => t.id === '12' ? { ...t, tag: travel } : t));
    await render();

    expect(fixture.debugElement.query(By.directive(Table)).componentInstance).toBe(table);
    expect(table.first).toBe(20);
    expect(table.filteredValue?.length).toBe(24);
    expect(table.filters['tag.name']).toBeDefined();
    expect(component.transactions()[12].tag).toEqual(travel);
    expect(JSON.parse(sessionStorage.getItem('statement-table') ?? '{}').first).toBe(20);
  });

  it('clamps the page after removing tags from similar transactions', async () => {
    transactions = makeTransactions(21);
    component.transactions.set(transactions);
    await render();
    await filter('tag.name', 'Food');
    page(20);
    component.selectedTagId.set(null);
    transactionService.getUserTransactionsByYear.and.returnValue(
      of(transactions.map((t, index) => index >= 19 ? { ...t, tag: null } : t))
    );
    component.saveSimilarOriginTag(transactions[20]);
    await render();

    expect(tagService.tagSimilarOriginTransactions).toHaveBeenCalledWith('20', null);
    expect(table.first).toBe(10);
    expect(table.filteredValue?.length).toBe(19);
    expect(JSON.parse(sessionStorage.getItem('statement-table') ?? '{}').first).toBe(10);
  });

  it('preserves the unfiltered page and restores it from session state', async () => {
    page(10);
    component.selectedTagId.set(travel.id);
    component.saveTag(transactions[12]);
    await render();
    expect(table.first).toBe(10);

    fixture.destroy();
    fixture = TestBed.createComponent(StatementComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    table = fixture.debugElement.query(By.directive(Table)).componentInstance;
    expect(table.first).toBe(10);
  });

  it('uses a filter changed while the bulk refresh is in flight', async () => {
    await filter('origin', 'Shop');
    page(10);
    const refresh = new Subject<Transaction[]>();
    transactionService.getUserTransactionsByYear.and.returnValue(refresh);
    component.saveSimilarOriginTag(transactions[12]);
    await filter('origin', 'Shop 0');
    refresh.next(transactions.map(t => ({ ...t })));
    await render();

    expect(table.first).toBe(0);
    expect(table.filteredValue?.length).toBe(10);
    expect(table.filters['origin']).toBeDefined();
  });

  it('preserves the current state when a bulk refresh fails', async () => {
    await filter('origin', 'Shop');
    page(10);
    transactionService.getUserTransactionsByYear.and.returnValue(throwError(() => new Error('refresh failed')));
    component.saveSimilarOriginTag(transactions[12]);
    await render();

    expect(table.first).toBe(10);
    expect(table.filters['origin']).toBeDefined();
    expect(component.transactions()).toBe(transactions);
    expect(component.isRefreshingTransactions()).toBeFalse();
    expect(errorHandler.showErrorToast).toHaveBeenCalled();
  });

  it('leaves data and state unchanged when a tag request fails', async () => {
    await filter('origin', 'Shop');
    page(10);
    tagService.tagTransaction.and.returnValue(throwError(() => new Error('tag failed')));
    component.selectedTagId.set(travel.id);
    component.saveTag(transactions[12]);
    await render();

    expect(table.first).toBe(10);
    expect(table.filters['origin']).toBeDefined();
    expect(component.transactions()).toBe(transactions);
    expect(errorHandler.showErrorToast).toHaveBeenCalled();
  });

  it('ignores a stale bulk refresh after the year changes', async () => {
    const refresh = new Subject<Transaction[]>();
    const newYearTransactions = makeTransactions(3);
    transactionService.getUserTransactionsByYear.and.returnValues(refresh, of(newYearTransactions));
    component.saveSimilarOriginTag(transactions[12]);
    selectedYear.set({ year: 2025 });
    await render();
    refresh.next(transactions);
    await render();

    expect(transactionService.getUserTransactionsByYear).toHaveBeenCalledWith(2025);
    expect(component.transactions()).toBe(newYearTransactions);
    expect(component.isLoading()).toBeFalse();
    expect(component.isRefreshingTransactions()).toBeFalse();
  });
});
