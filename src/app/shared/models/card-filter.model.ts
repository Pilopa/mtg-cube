export const FILTER_PROPERTY_SEPARATOR = ';';

/**
 * An enum describing all card properties that can be filtered by.
 */
export enum CardFilterKey {
  NAME = 'name',
  TEXT = 'text',
  CMC = 'cmc',
  COLORS = 'colors',
  POWER = 'power',
  TOUGHNESS = 'toughness',
  LOYALTY = 'loyalty',
  COLOR_IDENTITY = 'colorIdentity',
  SUPERTYPES = 'supertypes',
  TYPES = 'types',
  SUBTYPES = 'subtypes',
  RARITY = 'rarity',
  SETS = 'sets'
}

/**
 * An array containing all filter keys.
 */
export const CARD_FILTER_KEY_VALUES = [
  CardFilterKey.NAME,
  CardFilterKey.TEXT,
  CardFilterKey.CMC,
  CardFilterKey.COLOR_IDENTITY,
  CardFilterKey.COLORS,
  CardFilterKey.LOYALTY,
  CardFilterKey.POWER,
  CardFilterKey.RARITY,
  CardFilterKey.SETS,
  CardFilterKey.SUBTYPES,
  CardFilterKey.SUPERTYPES,
  CardFilterKey.TOUGHNESS,
  CardFilterKey.TYPES
];

/**
 * A map containing the maximum values of all numeric filters
 */
export const MAX_FILTER_VALUES: {
  [key in CardFilterKey]?: number;
} = {
  [CardFilterKey.CMC]: 16,
  [CardFilterKey.POWER]: 15,
  [CardFilterKey.TOUGHNESS]: 15,
  [CardFilterKey.LOYALTY]: 7
};

export enum CardFilterType {
  NUMERIC = 'numeric',
  CATEGORIC = 'categoric',
  TEXT = 'text'
}

export interface CardFilterModel {
  type: CardFilterType;
}

export interface NumericFilterModel extends CardFilterModel {
  type: CardFilterType.NUMERIC;
  min: number; // Defaults to 0
  max: number; // Defaults to the maximum for the associated filter key
}

export interface CategoricFilterModel extends CardFilterModel {
  type: CardFilterType.CATEGORIC;
  selectedCategories: string[];
  excludeUnselected?: boolean; // Might have an effect on performance because all possible indices have to be loaded
  mustIncludeAll?: boolean; // Whether a card has to be in all categories to match or only in at least one
}

export interface TextFilterModel extends CardFilterModel {
  type: CardFilterType.TEXT;
  value: string;
  requireFullMatch?: boolean; // Whether all or only some of the search words have to match for a hit
  allowPartialMatch?: boolean; // Defines whether parts of words count as potential hits as well, might have an effect on search performance
}

export interface FilterCategoryModel {
  label: string;
  value: any;
}

/**
 * A map containing the filter type for each filter key.
 */
export const CARD_FILTER_KEY_TYPE_MAP = {
  [CardFilterKey.NAME]: CardFilterType.TEXT,
  [CardFilterKey.TEXT]: CardFilterType.TEXT,
  [CardFilterKey.CMC]: CardFilterType.NUMERIC,
  [CardFilterKey.POWER]: CardFilterType.NUMERIC,
  [CardFilterKey.TOUGHNESS]: CardFilterType.NUMERIC,
  [CardFilterKey.LOYALTY]: CardFilterType.NUMERIC,
  [CardFilterKey.COLORS]: CardFilterType.CATEGORIC,
  [CardFilterKey.COLOR_IDENTITY]: CardFilterType.CATEGORIC,
  [CardFilterKey.SUPERTYPES]: CardFilterType.CATEGORIC,
  [CardFilterKey.TYPES]: CardFilterType.CATEGORIC,
  [CardFilterKey.SUBTYPES]: CardFilterType.CATEGORIC,
  [CardFilterKey.RARITY]: CardFilterType.CATEGORIC,
  [CardFilterKey.SETS]: CardFilterType.CATEGORIC
};

/**
 * A type that maps filter keys (e.g. 'cmc') to filter states.
 */
export type FilterDefinition = {
  [key in CardFilterKey]: CardFilterModel;
};

export type CardFilterEntry = [CardFilterKey, CardFilterModel];
