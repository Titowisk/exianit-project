import { Category } from './enums/category.enum';

export interface CategoryAnalytics {
    category: Category;
    label: string;
    color: string; // hexadecimal color code
}
