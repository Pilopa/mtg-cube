import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as LayoutActions from '@app/shared/state/layout/layout.state.actions';
import { CardIndexService } from '@app/shared/services/card-index.service';
import { of, Observable, Subject, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { CardDataState, CardDataFunction, CardDataHashFunction } from '../../../shared/state/card-data/card-data.state';
import { map, switchMapTo, switchMap, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { getCubeCardModels } from '@app/shared/utils/card-utils';
import { flatten } from 'lodash-es';
import safeForkJoin from '../../../shared/utils/safe-fork-join';
import { LoadCardData } from '@app/shared/state/card-data/card-data.state.actions';

@Component({
  selector: 'app-card-search-page',
  templateUrl: './card-search-page.component.html',
  styleUrls: ['./card-search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardSearchPageComponent implements OnInit, OnDestroy {

  private cardIds$ = of([
    'lightningbolt'
  ]);

  @Select(CardDataState.getCardDataFn)
  cardDataFn$: Observable<CardDataFunction>;

  @Select(CardDataState.getCardHashFn)
  cardHashFn$: Observable<CardDataHashFunction>;

  cards$ = combineLatest(this.cardIds$, this.cardHashFn$.pipe(distinctUntilChanged())).pipe(
    switchMap(([cardIds, hashFn]) => this.store.dispatch(cardIds.map(cardId => {
      const cardHash = hashFn(cardId);
      return typeof cardHash === 'string' ? new LoadCardData(cardHash) : undefined;
    }).filter(action => action !== undefined)).pipe(
      switchMapTo(this.cardDataFn$),
      map(dataFn => flatten(cardIds.map(cardId => getCubeCardModels(dataFn(cardId))))))
    )
  );

  readonly _destroy$ = new Subject<void>();

  @Dispatch()
  public readonly toggleSideContent = () => new LayoutActions.ToggleSideContentVisible()

  constructor(private readonly store: Store, cardIndex: CardIndexService) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this._destroy$.next();
  }

}
