import { CardFilterKey } from '@app/shared/models/card-filter.model';

/**
 * A map describing the whole structure of the index version document
 */
export type CardIndexVersionMap = {
  [key in CardFilterKey]: CardIndexVersion;
};

/**
 * Maps card filter values to index hashes
 */
export interface CardIndexVersion {
  [value: string]: string;
}

/**
 * Maps index hashes to lists of card names or a search index object (see elasticlunr)
 */
export interface CardIndexMap {
  [hash: string]: string[] | any;
}
