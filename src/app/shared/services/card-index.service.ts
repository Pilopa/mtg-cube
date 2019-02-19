import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { FilterDefinition, CardFilterKey, CardFilterModel, getFilterOptions } from '@app/shared/models/card-filter.model';
import { of, Observable } from 'rxjs';
import { map, switchMap, switchMapTo } from 'rxjs/operators';
import { getActiveFilters, isNumericFilter, isTextFilter,
   isCategoricFilter, getNumericFilterPaths } from '@app/shared/utils/card-filter-utils';
import { CardIndexState } from '@app/shared/state/card-index/card-index.state';
import { union, intersectionWith } from 'lodash-es';
import { AppError } from '@app/shared/models/error.model';
import * as CardIndexActions from '../state/card-index/card-index.state.actions';
import safeForkJoin from '@app/shared/utils/safe-fork-join';

@Injectable({
  providedIn: 'root'
})
export class CardIndexService {

  constructor(private store: Store) { }

  /**
   * Asynchronously searches for cards with the given filters applied.
   *
   * @returns An array of card ids
   */
  public query$(filterObject: FilterDefinition): Observable<string[]> {
    return of(filterObject).pipe(
      map(filters => getActiveFilters(filters)),
      switchMap(filters => safeForkJoin(Object.entries(filters)
                                          .map(([key, value]) => value ? this.getFilterValues(key as CardFilterKey, value) : of(null)))),
      // Ignore filters with no input
      map(indices => indices.filter(list => Array.isArray(list))),
      // Combine all results by applying an intersection (AND), a card has to be in ALL lists to be a hit
      map((indices: string[][]) => intersectionWith(...indices))
    );
  }

  private getFilterValues(key: CardFilterKey, filter: CardFilterModel): Observable<string[]> {
    if (isNumericFilter(filter)) {
      const numericFilterPaths = getNumericFilterPaths(key, filter);
      return this.store.dispatch(new CardIndexActions.LoadIndices(...numericFilterPaths)).pipe(
        switchMapTo(this.store.select(CardIndexState.getIndexFn)),
        map(indexFn => numericFilterPaths.map(filterValuePath => indexFn(filterValuePath))),
        map(indices => union(...indices))
      );
    } else if (isCategoricFilter(filter)) {
      const filterCategoryPaths = filter.selectedCategories.map(category => [key, category]);

      if (filter.excludeUnselected) {
        const unselectedCategories = getFilterOptions(key).filter(category => !filter.selectedCategories.includes(category));
        const unselectedCategoryPaths = unselectedCategories.map(category => [key, category]);

        return this.store.dispatch(new CardIndexActions.LoadIndices(...filterCategoryPaths, ...unselectedCategoryPaths)).pipe(
          switchMapTo(this.store.select(CardIndexState.getIndexFn)),
          map(indexFn => {
            const selectedIndices =  filterCategoryPaths.map(path => indexFn(path));
            const unselectedIndices =  unselectedCategoryPaths.map(path => indexFn(path));
            const selectedCardNames = filter.mustIncludeAll ? intersectionWith(...selectedIndices) : union(...selectedIndices);
            const unselectedCardNames = union(...unselectedIndices);
            return selectedCardNames.filter(cardName => !unselectedCardNames.includes(cardName));
          })
        );
      } else {
        return this.store.dispatch(new CardIndexActions.LoadIndices(...filterCategoryPaths)).pipe(
          switchMapTo(this.store.select(CardIndexState.getIndexFn)),
          map(indexFn => filterCategoryPaths.map(path => indexFn(path))),
          map(indices => filter.mustIncludeAll ? intersectionWith(...indices) : union(...indices))
        );
      }
    } else if (isTextFilter(filter)) {
      if (key === CardFilterKey.NAME) {
        return this.store.dispatch(new CardIndexActions.LoadIndices([`${key}`])).pipe(
          switchMapTo(this.store.select(CardIndexState.getNameSearchFn)),
          map(fn => fn(filter.value, filter.requireFullMatch || false, filter.allowPartialMatch || true))
        );
      } else if (key === CardFilterKey.TEXT) {
        return this.store.dispatch(new CardIndexActions.LoadIndices([`${key}`])).pipe(
          switchMapTo(this.store.select(CardIndexState.getTextSearchFn)),
          map(fn => fn(filter.value, filter.requireFullMatch || false, filter.allowPartialMatch || false))
        );
      } else {
        throw {
          code: 'card-db/invalid-text-filter',
          message: `Invalid text filter key '${key}'`
        } as AppError;
      }
    } else {
      throw {
        code: 'card-db/unkown-filter-type',
        message: `Unkown filter type for filter key '${key}'`
      } as AppError;
    }
  }

}
