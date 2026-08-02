import { Tag } from './tag.interface';

export interface TaggedSummaryMonth {
  month: string;
  tagAmounts: Record<string, number>;
  total: number;
}

export interface TaggedSummaryAggregates {
  tagAmounts: Record<string, number>;
  total: number;
}

export interface TaggedSummaryResponse {
  tags: Tag[];
  months: TaggedSummaryMonth[];
  totals: TaggedSummaryAggregates;
  averages: TaggedSummaryAggregates;
}
