import { CARD_FILTER_KEY_TYPE_MAP,
   CardFilterKey, CardFilterType,
   CardFilterModel, CategoricFilterModel,
   TextFilterModel, FILTER_PROPERTY_SEPARATOR,
   NumericFilterModel,
   MAX_FILTER_VALUES,
   FilterDefinition} from '@app/shared/models/card-filter.model';
import { Index } from 'elasticlunr';
import { pickBy } from 'lodash-es';

export type CardIndexFunction = (path: string[]) => string[];
export type TextSearchFunction = (query: string, requireFullMatch: boolean, allowPartialMatch) => string[];

export function createTextSearchFunction(index: any): TextSearchFunction {
  if (!index) {
    const indexObject = Index.load(index);
    return (query: string, requireFullMatch: boolean, allowPartialMatch) => {
      const indexResult = indexObject.search(query, {
        expand: !!allowPartialMatch,
        bool: requireFullMatch ? 'AND' : 'OR'
      });
      return indexResult.map(value => (value.ref as string).toLowerCase());
    };
  } else {
    return () => [];
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

export function getNumericFilterPaths(key: CardFilterKey, filter: NumericFilterModel): string[][] {
  const values = fromTo(filter.min || 0, filter.max || MAX_FILTER_VALUES[key] || 0);
  return values.map(filterValue => getFilterPath(key, filterValue));
}

export function getFilterPath(key: CardFilterKey, value: number): string[] {
  return [key, `${value}`];
}

export function getActiveFilters(filterObject: FilterDefinition): FilterDefinition {
  return pickBy(filterObject, (value, key) => isActiveFilter(value));
}

export function string2Filter(str: string, type: CardFilterType): CardFilterModel {
  const parts = str.split(FILTER_PROPERTY_SEPARATOR);
  if (str.length < 2) { throw new Error('Invalid filter format'); }
  switch (type) {
    case CardFilterType.CATEGORIC:
      return {
        type,
        mustIncludeAll: JSON.parse(parts[0].trim()),
        excludeUnselected: JSON.parse(parts[1].trim()),
        selectedCategories: JSON.parse(`[${parts[2].trim()}]`).filter(value => !!value)
      } as CategoricFilterModel;
    case CardFilterType.NUMERIC:
      return {
        type,
        min: JSON.parse(parts[0].trim()),
        max: JSON.parse(parts[1].trim())
      } as NumericFilterModel;
    case CardFilterType.TEXT:
      return {
        type,
        requireFullMatch: JSON.parse(parts[0]),
        allowPartialMatch: JSON.parse(parts[1]),
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
    return `${filter.min}${FILTER_PROPERTY_SEPARATOR}${filter.max}`;
  } else if (isCategoricFilter(filter)) {
    // tslint:disable-next-line:max-line-length
    return `${filter.mustIncludeAll ? 1 : 0}${FILTER_PROPERTY_SEPARATOR}${filter.excludeUnselected ? 1 : 0}${FILTER_PROPERTY_SEPARATOR}${JSON.stringify(filter.selectedCategories).slice(1, -1)}`;
  } else if (isTextFilter(filter)) {
    // tslint:disable-next-line:max-line-length
    return  `${filter.requireFullMatch ? 1 : 0}${FILTER_PROPERTY_SEPARATOR}${filter.allowPartialMatch ? 1 : 0}${FILTER_PROPERTY_SEPARATOR}${filter.value}`;
  } else {
    return null;
  }
}
