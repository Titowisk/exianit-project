export interface SourceStatement {
  id: string;
  sourceAccountId: string;
  statementDate: string;
  sourceName: string;
  sourceStatementType: {
    id: number;
    name: string;
  };
  transactionCount: number;
}
