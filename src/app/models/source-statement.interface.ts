export interface SourceStatement {
  id: string;
  sourceAccountId: string;
  statementDate: string;
  sourceName: string;
  sourceStatementType: {
    id: number;
    name: string;
  } | null;
  transactionCount: number;
  isPlaceholder: boolean;
}
