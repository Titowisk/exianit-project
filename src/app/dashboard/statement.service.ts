import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { StatementTransaction } from "../models/statement.interface";
import { Category } from '../models/enums/category.enum';
import { AuthService } from '../services/auth.service';
import { YearService } from '../header/year.service';

interface ApiTransaction {
    id: string;
    type: string;
    origin: string;
    amount: number;
    date: string;
    category: string;
    description?: string;
    bankStatementId: string;
}

@Injectable({
    providedIn: 'root'
})
export class StatementService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private yearService = inject(YearService);
    private apiUrl = 'https://localhost:7080/api';

    getAllStatements(): Observable<StatementTransaction[]> {
        const userId = this.authService.userId();
        const year = this.yearService.selectedYear().year;
        const url = `${this.apiUrl}/transactions?userId=${userId}&year=${year}`;
        
        return this.http.get<ApiTransaction[]>(url)
            .pipe(
                map(transactions => this.mapApiResponse(transactions))
            );
    }

    private mapApiResponse(apiData: ApiTransaction[]): StatementTransaction[] {
        return apiData.map(transaction => {
            const type = transaction.type.toLowerCase() as 'income' | 'expense';
            const category = this.mapCategoryToEnum(transaction.category, type);
            
            return {
                id: transaction.id,
                type,
                origin: transaction.origin,
                amount: transaction.amount,
                date: new Date(transaction.date),
                category,
                description: transaction.description
            } as StatementTransaction;
        });
    }

    private mapCategoryToEnum(category: string, type: 'income' | 'expense'): Category {
        const categoryEnum = Category[category as keyof typeof Category];
        if (!categoryEnum) {
            throw new Error(`Unknown category: ${category}`);
        }
        return categoryEnum;
    }
}