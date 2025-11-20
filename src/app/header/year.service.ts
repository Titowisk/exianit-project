import { Injectable, signal, computed } from '@angular/core';
import { YearItem } from '../models/year-item.interface';
import { YEARS_DATA } from '../data/years.data';

@Injectable({
  providedIn: 'root'
})
export class YearService {
  private _selectedYear = signal<YearItem>({ year: new Date().getFullYear() });
  
  // Public readonly signal for selected year
  selectedYear = this._selectedYear.asReadonly();
  
  // Computed property for display text
  selectedYearText = computed(() => `${this._selectedYear().year}`);
  
  // Get all available years
  getYears(): YearItem[] {
    return YEARS_DATA;
  }
  
  // Set the selected year
  setSelectedYear(year: YearItem): void {
    this._selectedYear.set(year);
  }
  
  // Get the current selected year value
  getCurrentYear(): number {
    return this._selectedYear().year;
  }
}
