export interface SourceAccount {
  id: string;
  userId: string;
  name: string;
  source: { id: number; name: string };
  availableStatementTypes: { id: number; name: string }[];
}
