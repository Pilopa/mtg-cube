import { NumericFilterOperator, CARD_FILTER_KEY_TYPE_MAP,
   CardFilterKey, CardFilterType,
   CardFilterModel, CategoricFilterModel,
   TextFilterModel, FILTER_PROPERTY_SEPARATOR,
   NumericFilterModel} from '@app/shared/models/card-filter.model';

/**
 * @param min The minimum value of the numeric filter
 * @param max The maximum value of the numeric filter
 *
 * @returns All possible values for the given filter operator
 */
export function getNumericFilterOptions(operator: NumericFilterOperator, min: number, max: number): number[] {
  switch (operator) {
    case NumericFilterOperator.GREATER_OR_EQUAL:
      return fromTo(min + 1, max);
    case NumericFilterOperator.LESSER_OR_EQUAL:
      return fromTo(0, max - 1);
    case NumericFilterOperator.EQUALS:
      return fromTo(0, max);
  }
}

/**
 * @returns An array containing all numbers from `from` to `to` (inclusive)
 */
function fromTo(from: number, to: number): number[] {
  const values: number[] = [];

  for (let i = from; i <= to; i++) {
    values.push(i);
  }

  return values;
}

/**
 * @returns The filter type for the given filter key
 */
export function getCardFilterKeyType(key: CardFilterKey): CardFilterType | undefined {
  return CARD_FILTER_KEY_TYPE_MAP[key];
}

/**
 * @returns Whether the given filter has enough information to filter by
 */
export function isActiveFilter(filter: CardFilterModel) {
  return (isNumericFilter(filter) && (filter.min > 0 || filter.max > 0 ))
  || ( isCategoricFilter(filter) && filter.selectedCategories.length > 0 )
  || ( isTextFilter(filter) && filter.value.length > 0 );
}

export function isNumericFilter(filter: CardFilterModel): filter is NumericFilterModel {
  return filter.type === CardFilterType.NUMERIC;
}

export function isCategoricFilter(filter: CardFilterModel): filter is CategoricFilterModel {
  return filter.type === CardFilterType.CATEGORIC;
}

export function isTextFilter(filter: CardFilterModel): filter is TextFilterModel {
  return filter.type === CardFilterType.TEXT;
}

export function string2Filter(str: string, type: CardFilterType): CardFilterModel {
  const parts = str.split(FILTER_PROPERTY_SEPARATOR);
  if (str.length < 2) { throw new Error('Invalid filter format'); }
  switch (type) {
    case CardFilterType.CATEGORIC:
      return {
        type,
        excludeUnselected: JSON.parse(parts[0].trim()),
        selectedCategories: JSON.parse(`[${parts[1].trim()}]`).filter(value => !!value)
      } as CategoricFilterModel;
    case CardFilterType.NUMERIC:
      return {
        type,
        operator: parts[0] as any as NumericFilterOperator,
        min: JSON.parse(parts[1].trim()),
        max: JSON.parse(parts[2].trim())
      } as NumericFilterModel;
    case CardFilterType.TEXT:
      return {
        type,
        textFilterType: parts[0],
        and: JSON.parse(parts[1]),
        value: parts[2]
      } as TextFilterModel;
    default:
      throw new Error('Invalid filter type');
  }
}

export function filter2String(filter: CardFilterModel): string | null {
  if (!isActiveFilter(filter)) {
    return null;
  }
  if (isNumericFilter(filter)) {
    return `${filter.operator}${FILTER_PROPERTY_SEPARATOR}${filter.min}${FILTER_PROPERTY_SEPARATOR}${filter.max}`;
  } else if (isCategoricFilter(filter)) {
    return `${filter.excludeUnselected ? 1 : 0}${FILTER_PROPERTY_SEPARATOR}${JSON.stringify(filter.selectedCategories).slice(1, -1)}`;
  } else if (isTextFilter(filter)) {
    return  `${filter.type}${FILTER_PROPERTY_SEPARATOR}${filter.and}${FILTER_PROPERTY_SEPARATOR}${filter.value}`;
  } else {
    return null;
  }
}
