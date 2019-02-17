import { CardFilterKey, NumericFilterOperator } from '@app/shared/models/card-filter.model';

/**
 * A map describing the whole structure of the index version document
 */
export type CardIndexVersionMap = {
  [key in CardFilterKey]: BaseCardIndexVersion | NumericCardIndexVersion;
};

/**
 * Maps card filter values to index hashes
 */
export interface BaseCardIndexVersion {
  [value: string]: string;
}

/**
 * Maps card filter operators to index version maps
 */
export type NumericCardIndexVersion = {
  [operator in NumericFilterOperator]: BaseCardIndexVersion;
};

/**
 * Maps index hashes to lists of card names
 */
export interface CardIndexMap {
  [hash: string]: string[];
}
