import { Injectable } from '@angular/core';
import { Statement } from "../models/statement.interface";
import { STATEMENTS_DATA } from "../data/statements.data";

@Injectable({
    providedIn: 'root'
})
export class StatementService {
    private statements: Statement[] = STATEMENTS_DATA;

    getAllStatements(): Statement[] {
        return this.statements;
    }
}