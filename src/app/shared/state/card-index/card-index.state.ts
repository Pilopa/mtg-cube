import { State, Action, StateContext, NgxsOnInit } from '@ngxs/store';
import * as CardIndexActions from './card-index.state.actions';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

export interface CardIndexStateModel {
  versions: any | undefined;
  incides: any | undefined;
}

@State<CardIndexStateModel>({
  name: 'cardIndex',
  defaults: {
    versions: undefined,
    incides: undefined
  }
})
export class CardIndexState implements NgxsOnInit {

  constructor(private readonly http: HttpClient) { }

  ngxsOnInit({ dispatch }: StateContext<any>) {
    return dispatch(new CardIndexActions.UpdateIndexVersions());
  }

  @Action(CardIndexActions.UpdateIndexVersions, { cancelUncompleted: true })
  public updateIndexVersions({ patchState }: StateContext<CardIndexStateModel>) {
    return from(this.http.get(`assets/indices/versions-${environment.indexVersionHash}.json`)).pipe(
      tap(versions => patchState({ versions }))
    );
  }

}
