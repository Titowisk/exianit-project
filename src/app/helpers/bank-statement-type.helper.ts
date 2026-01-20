import { BankStatementType } from '../models/enums/bank-statement-type.enum';

export interface BankStatementTypeOption {
  value: BankStatementType;
  label: string;
}

export function getBankStatementTypeLabel(type: BankStatementType): string {
  switch (type) {
    case BankStatementType.BtgCardStatement:
      return 'BTG Card Statement';
    case BankStatementType.BtgCheckingAccountStatement:
      return 'BTG Checking Account Statement';
    case BankStatementType.NubankStatement:
      return 'Nubank Statement';
    default:
      return 'Unknown Statement Type';
  }
}

export function getBankStatementTypeOptions(): BankStatementTypeOption[] {
  return [
    { value: BankStatementType.BtgCardStatement, label: getBankStatementTypeLabel(BankStatementType.BtgCardStatement) },
    { value: BankStatementType.BtgCheckingAccountStatement, label: getBankStatementTypeLabel(BankStatementType.BtgCheckingAccountStatement) },
    { value: BankStatementType.NubankStatement, label: getBankStatementTypeLabel(BankStatementType.NubankStatement) },
  ];
}
