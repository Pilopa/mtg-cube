import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as LayoutActions from '@app/shared/state/layout/layout.state.actions';
import { CardIndexService } from '@app/shared/services/card-index.service';
import { of, Observable, Subject } from 'rxjs';
import { Select } from '@ngxs/store';
import { CardDataState, CardDataFunction } from '../../../shared/state/card-data/card-data.state';
import { takeUntil } from 'rxjs/operators';
import { MinifiedCardModel } from '../../../shared/models/static/card.model';

@Component({
  selector: 'app-card-search-page',
  templateUrl: './card-search-page.component.html',
  styleUrls: ['./card-search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardSearchPageComponent implements OnInit, OnDestroy {

  private testCardNames$ = of([
    'lightningbolt'
  ]);

  @Select(CardDataState.getCardDataFn)
  cardDataFn$: Observable<CardDataFunction>;

  cards$ = this.testCardNames$.pipe(

  );

  readonly _destroy$ = new Subject<void>();

  @Dispatch()
  public readonly toggleSideContent = () => new LayoutActions.ToggleSideContentVisible()

  constructor(cardIndex: CardIndexService) { }

  ngOnInit(): void {
    this.testCardNames$.pipe(
      takeUntil(this._destroy$)
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }

}
