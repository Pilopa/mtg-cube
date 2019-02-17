import { State, Action, StateContext, NgxsOnInit, Selector } from '@ngxs/store';
import * as CardIndexActions from './card-index.state.actions';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { CardIndexVersionMap, CardIndexMap } from '@app/shared/models/static/card-index.model';
import { getObjectPathValue } from '@app/shared/utils/object-path-value';

export interface CardIndexStateModel {
  versions: CardIndexVersionMap | undefined;
  incides: CardIndexMap;
}

@State<CardIndexStateModel>({
  name: 'cardIndex',
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
    return state.incides;
  }

  @Selector([CardIndexState.getIndexVersions])
  private static indexHashFn(_, indexVersions: CardIndexVersionMap | undefined): CardIndexHashFunction {
    return (path: string[]) => indexVersions ? getObjectPathValue(indexVersions, path.join('.')) : undefined;
  }

  @Selector([CardIndexState.getIndices, CardIndexState.indexHashFn])
  static getIndexFn(_, indices: CardIndexMap, fn: CardIndexHashFunction): CardIndexFunction {
    return (path: string[]) => indices[fn(path) || ''];
  }

  constructor(private readonly http: HttpClient) { }

  ngxsOnInit({ dispatch }: StateContext<any>) {
    return dispatch(new CardIndexActions.UpdateIndexVersions());
  }

  @Action(CardIndexActions.UpdateIndexVersions, { cancelUncompleted: true })
  public updateIndexVersions({ patchState }: StateContext<CardIndexStateModel>) {
    return from(this.http.get<CardIndexVersionMap>(`assets/indices/versions-${environment.indexVersionHash}.json`)).pipe(
      tap(versions => patchState({ versions }))
    );
  }

}

export type CardIndexHashFunction = (path: string[]) => string | undefined;
export type CardIndexFunction = (path: string[]) => string[] | undefined;
