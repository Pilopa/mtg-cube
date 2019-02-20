import { State, Action, StateContext, NgxsOnInit, Selector, Store } from '@ngxs/store';
import * as CardIndexActions from './card-index.state.actions';
import { HttpClient } from '@angular/common/http';
import { from, of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { CardIndexVersionMap, CardIndexMap } from '@app/shared/models/static/card-index.model';
import { getObjectPathValue } from '@app/shared/utils/object-path-value';
import { CardIndexFunction, TextSearchFunction, createTextSearchFunction } from '@app/shared/utils/card-filter-utils';
import { AppError } from '@app/shared/models/error.model';
import { produce } from 'immer';
import safeForkJoin from '@app/shared/utils/safe-fork-join';

export interface CardIndexStateModel {
  versions: CardIndexVersionMap | undefined;
  incides: CardIndexMap;
}

@State<CardIndexStateModel>({
  name: 'cardIndices',
  defaults: {
    versions: undefined,
    incides: {}
  }
})
export class CardIndexState implements NgxsOnInit {

  @Selector()
  private static getIndexVersions(state: CardIndexStateModel) {
    return state.versions;
  }

  @Selector()
  private static getIndices(state: CardIndexStateModel) {
    return state.incides || {};
  }

  @Selector([CardIndexState.getIndexVersions])
  private static indexHashFn(_, indexVersions: CardIndexVersionMap | undefined): CardIndexHashFunction {
    return (path: string[]) => indexVersions ? getObjectPathValue(indexVersions, path.join('.')) : undefined;
  }

  @Selector([CardIndexState.getIndices, CardIndexState.indexHashFn])
  static getIndexFn(_, indices: CardIndexMap, fn: CardIndexHashFunction): CardIndexFunction {
    return (path: string[]) => indices[fn(path) || ''] || [];
  }

  @Selector([CardIndexState.getIndexFn])
  static getTextSearchFn(_, fn: CardIndexFunction): TextSearchFunction {
    return createTextSearchFunction(fn(['text']));
  }

  @Selector([CardIndexState.getIndexFn])
  static getNameSearchFn(_, fn: CardIndexFunction): TextSearchFunction {
    return createTextSearchFunction(fn(['name']));
  }

  constructor(private readonly http: HttpClient, private readonly store: Store) { }

  ngxsOnInit({ dispatch }: StateContext<any>) {
    return dispatch(new CardIndexActions.UpdateIndexVersions());
  }

  @Action(CardIndexActions.UpdateIndexVersions, { cancelUncompleted: true })
  public updateIndexVersions({ patchState }: StateContext<CardIndexStateModel>) {
    return from(this.http.get<CardIndexVersionMap>(`assets/indices/versions-${environment.indexVersionHash}.json`)).pipe(
      tap(versions => patchState({ versions }))
    );
  }

  @Action(CardIndexActions.LoadIndices)
  public loadIndices({ getState, setState }: StateContext<CardIndexStateModel>, { paths }: CardIndexActions.LoadIndices) {
    const getIndexHashFn = this.store.selectSnapshot(CardIndexState.indexHashFn);
    const hashes = paths.map(path => {
      const hash = getIndexHashFn(path);
      if (!hash) {
        throw {
          code: `card-db/unknown-index`,
          message: `Could not find index definition for index ${path.join('.')}`
        } as AppError;
      } else {
        return hash;
      }
    });

    const loadObservables = hashes.map(hash => this.loadIndex(hash));
    return safeForkJoin(loadObservables).pipe(
      tap(entries => {
        if (entries.length) {
          setState(produce(getState(), draft => {
            for (const entry of entries) {
              if (!draft.incides[entry[0]]) {
                draft.incides[entry[0]] = entry[1];
              }
            }
          }));
        }
      })
    );
  }

  /**
   * Asynchronously loads the index with the given hash.
   *
   * If the index is already cached, the cached version is returned instead.
   *
   * @param hash The hash of the index to load
   * @returns A tuple that contains the hash and the associated index value
   */
  private loadIndex(hash: string): Observable<[string, any]> {
    const loadedIndex = (this.store.selectSnapshot(CardIndexState.getIndices) || {})[hash];
    return loadedIndex ? of([hash, loadedIndex] as [string, any]) : this.http.get<String[] | any>(`assets/indices/data/${hash}.json`).pipe(
      map(index => ([hash, index] as [string, any]))
    );
  }

}

type CardIndexHashFunction = (path: string[]) => string | undefined;
