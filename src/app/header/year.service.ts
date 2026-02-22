import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { YearItem } from '../models/year-item.interface';
import { AuthService } from '../services/auth.service';

const SELECTED_YEAR_KEY = 'selectedYear';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'https://localhost:7080/api';
  
  private _selectedYear = signal<YearItem>({ year: new Date().getFullYear() });
  private _availableYears = signal<YearItem[]>([]);
  private _isLoadingYears = signal<boolean>(false);
  private _yearsError = signal<string | null>(null);
  
  // Public readonly signals
  selectedYear = this._selectedYear.asReadonly();
  availableYears = this._availableYears.asReadonly();
  isLoadingYears = this._isLoadingYears.asReadonly();
  yearsError = this._yearsError.asReadonly();
  
  // Computed property for display text
  selectedYearText = computed(() => `${this._selectedYear().year}`);
  
  // Load years from API
  loadYears(): void {
    const userId = this.authService.userId();
    if (!userId) {
      this._yearsError.set('User not authenticated');
      return;
    }

    this._isLoadingYears.set(true);
    this._yearsError.set(null);

    this.fetchYears(userId).subscribe({
      next: (years) => {
        // Map number[] to YearItem[] format
        const yearItems = years.map(year => ({ year }));
        this._availableYears.set(yearItems);
        this._isLoadingYears.set(false);

        // Restore selected year from localStorage if it exists in available years
        const savedYearStr = localStorage.getItem(SELECTED_YEAR_KEY);
        if (savedYearStr) {
          const savedYear = parseInt(savedYearStr, 10);
          const savedYearItem = yearItems.find(item => item.year === savedYear);
          if (savedYearItem) {
            this._selectedYear.set(savedYearItem);
            return;
          }
        }

        // If no saved year or saved year not available, select current year if in list
        const currentYear = new Date().getFullYear();
        const currentYearItem = yearItems.find(item => item.year === currentYear);
        if (currentYearItem) {
          this._selectedYear.set(currentYearItem);
          return;
        }

        // If current year not available and list not empty, select most recent year
        if (yearItems.length > 0) {
          const mostRecentYear = yearItems.reduce((max, item) => 
            item.year > max.year ? item : max
          );
          this._selectedYear.set(mostRecentYear);
        }
      },
      error: (error) => {
        this._isLoadingYears.set(false);
        this._yearsError.set('Failed to load years. Please try again.');
        console.error('Error loading years:', error);
      }
    });
  }
  
  // Get all available years
  getYears(): YearItem[] {
    return this._availableYears();
  }
  
  // Set the selected year and persist to localStorage
  setSelectedYear(year: YearItem): void {
    this._selectedYear.set(year);
    localStorage.setItem(SELECTED_YEAR_KEY, year.year.toString());
  }
  
  // Get the current selected year value
  getCurrentYear(): number {
    return this._selectedYear().year;
  }

  // Fetch available years from API
  private fetchYears(userId: string): Observable<number[]> {
    return this.http.get<number[]>(
      `${this.apiUrl}/transactions/years?userId=${userId}`
    );
  }
}
