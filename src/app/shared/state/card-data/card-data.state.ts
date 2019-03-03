import { State, StateContext, Action, Selector } from '@ngxs/store';
import { HttpClient } from '@angular/common/http';
import { CardMapModel, CardVersionMapModel, MinifiedCardModel } from '../../models/static/card.model';
import { environment } from 'src/environments/environment';
import * as CardDataActions from './card-data.state.actions';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import produce from 'immer';

export interface CardDataStateModel {
  versions: CardVersionMapModel;
  data: CardMapModel;
}

@State<CardDataStateModel>({
  name: 'cardData',
  defaults: {
    versions: {},
    data: {}
  }
})
export class CardDataState {

  @Selector()
  private static getCardVersions(state: CardDataStateModel) {
    return state.versions || {};
  }

  @Selector()
  private static getCardData(state: CardDataStateModel) {
    return state.data || {};
  }

  @Selector([CardDataState.getCardVersions])
  static getCardHashFn(_, indexVersions: CardVersionMapModel): CardDataHashFunction {
    return (cardId: string) => indexVersions[cardId];
  }

  @Selector([CardDataState.getCardData, CardDataState.getCardHashFn])
  static getCardDataFn(_, cardData: CardMapModel, fn: CardDataHashFunction): CardDataFunction {
    return (cardId: string) =>  {
      const cardHash = fn(cardId);
      return typeof cardHash === 'string' ? cardData[cardHash] : undefined;
    };
  }

  constructor(private readonly http: HttpClient) {}

  ngxsOnInit({ dispatch }: StateContext<any>) {
    return dispatch(new CardDataActions.UpdateIndexVersions());
  }

  @Action(CardDataActions.UpdateIndexVersions, { cancelUncompleted: true })
  public updateIndexVersions({ patchState }: StateContext<CardDataStateModel>) {
    return from(this.http.get<CardVersionMapModel>(`assets/cards/versions-${environment.cardVersionHash}.json`)).pipe(
      tap(versions => patchState({ versions }))
    );
  }

  @Action(CardDataActions.LoadCardData)
  public loadCardData({ setState, getState }: StateContext<CardDataStateModel>, { hash }: CardDataActions.LoadCardData) {
    if (getState().data[hash]) {
      return;
    }

    return from(this.http.get<MinifiedCardModel>(`assets/cards/singles/${hash}.json`)).pipe(
      tap(cardData => setState(produce(getState(), draft => {
        draft.data[hash] = cardData;
      })))
    );
  }

}

export type CardDataHashFunction = (cardId: string) => string | undefined;
export type CardDataFunction = (cardId: string) => MinifiedCardModel | undefined;
