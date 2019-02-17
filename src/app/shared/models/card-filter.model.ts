/**
 * A map containing the maximum values of all numeric filters
 */
export const MAX_VALUES = {
  cmc: 16,
  power: 15,
  toughness: 15,
  loyalty: 7
};

export const FILTER_PROPERTY_SEPARATOR = ';';

/**
 * Types of available numeric filter operators.
 * Lesser and greater operators are ommitted because they can be logically replaced by other operator types.
 *
 * e.g. greater than 1 becomes greater than or equal to 2
 */
export enum NumericFilterOperator {
  EQUALS = 0,
  LESSER_OR_EQUAL = 1,
  GREATER_OR_EQUAL = 2
}

export const DEFAULT_NUMERIC_FILTER_OPERATOR = NumericFilterOperator.EQUALS;

export const NumericFilterOperatorValues = [
  NumericFilterOperator.EQUALS,
  NumericFilterOperator.GREATER_OR_EQUAL,
  NumericFilterOperator.LESSER_OR_EQUAL
];

export enum CardFilterType {
  NUMERIC = 'numeric',
  CATEGORIC = 'categoric',
  TEXT = 'text'
}

export enum TextFilterType {
  NAME = 'name',
  TEXTBOX = 'text'
}

export interface CardFilterModel {
  type: CardFilterType;
}

export interface NumericFilterModel extends CardFilterModel {
  type: CardFilterType.NUMERIC;
  operator: NumericFilterOperator;
  min: number;
  max: number;
}

export interface CategoricFilterModel extends CardFilterModel {
  type: CardFilterType.CATEGORIC;
  selectedCategories: string[];
  excludeUnselected?: boolean;
}

export interface TextFilterModel extends CardFilterModel {
  type: CardFilterType.TEXT;
  textFilterType: TextFilterType;
  value: string;
  and?: boolean;
}

export interface FilterCategoryModel {
  label: string;
  value: any;
}

/**
 * An enum describing all card properties that can be filtered by.
 */
export enum CardFilterKey {
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
 * A map containing the filter type for each filter key.
 */
export const CARD_FILTER_KEY_TYPE_MAP = {
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
