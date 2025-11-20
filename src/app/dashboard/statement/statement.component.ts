import { Component, inject } from '@angular/core';
import { StatementService } from '../statement.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { YearService } from '../../header/year.service';

@Component({
  selector: 'app-statement',
  imports: [TableModule, CommonModule],
  templateUrl: './statement.component.html',
  styleUrl: './statement.component.scss'
})
export class StatementComponent {
  private statementService: StatementService = inject(StatementService);
  yearService = inject(YearService);

  get statements() {
    return this.statementService.getAllStatements();
  }
}
