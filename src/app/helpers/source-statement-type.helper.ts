import { SourceStatementType } from '../models/enums/source-statement-type.enum';

export interface SourceStatementTypeOption {
  value: SourceStatementType;
  label: string;
}

export function getSourceStatementTypeLabel(type: SourceStatementType): string {
  switch (type) {
    case SourceStatementType.BtgCardStatement:
      return 'BTG Card Statement';
    case SourceStatementType.BtgCheckingAccountStatement:
      return 'BTG Checking Account Statement';
    case SourceStatementType.NubankStatement:
      return 'Nubank Statement';
    default:
      return 'Unknown Statement Type';
  }
}

export function getSourceStatementTypeOptions(): SourceStatementTypeOption[] {
  return [
    { value: SourceStatementType.BtgCardStatement, label: getSourceStatementTypeLabel(SourceStatementType.BtgCardStatement) },
    { value: SourceStatementType.BtgCheckingAccountStatement, label: getSourceStatementTypeLabel(SourceStatementType.BtgCheckingAccountStatement) },
    { value: SourceStatementType.NubankStatement, label: getSourceStatementTypeLabel(SourceStatementType.NubankStatement) },
  ];
}
