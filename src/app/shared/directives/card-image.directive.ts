import { Directive, HostBinding, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { Store, Select } from '@ngxs/store';
import { Subject, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { takeUntil, map, switchMap, switchMapTo, tap, distinctUntilChanged, filter } from 'rxjs/operators';
import { LoadImage } from '../state/card-image/card-image.state.actions';
import { CardImageState, GetImageFn } from '../state/card-image/card-image.state';
import { LayoutState } from '../state/layout/layout.state';
import { LayoutSize } from '../models/layout-size.model';
import { CardImageSize } from '../models/card-image.model';
import { layoutSize2CardImageSize } from '../utils/card-image-utils';

@Directive({
  selector: '[appCardImage]'
})
export class CardImageDirective implements OnDestroy {

  @Input('appCardImage')
  set multiverseId(newMultiverseId: number) {
    this._multiverseId$.next(newMultiverseId);
  }

  @Input()
  set cardImageSize(newCardImageSize: CardImageSize | undefined) {
    this._cardImageSize$.next(newCardImageSize);
  }

  @HostBinding('style.background')
  cardBackground: SafeStyle;

  @HostBinding('class.card-image')
  cardImageClass = true;

  @Select(CardImageState.getCardImageFn)
  cardImageFn$: Observable<GetImageFn>;

  @Select(LayoutState.getLayoutSize)
  layoutSize$: Observable<LayoutSize>;

  private readonly _destroy$ = new Subject<void>();
  private readonly _multiverseId$ = new Subject<number>();
  private readonly _cardImageSize$ = new BehaviorSubject<CardImageSize | undefined>(undefined);

  constructor(private readonly sanitizer: DomSanitizer, private readonly store: Store, private readonly change: ChangeDetectorRef) {
    combineLatest(this._multiverseId$, combineLatest(this.layoutSize$, this._cardImageSize$).pipe(
      map(([layoutSize, cardImageSize]) => cardImageSize || layoutSize2CardImageSize(layoutSize))
    )).pipe(
      switchMap(([multiverseId, cardImageSize]) => this.store.dispatch(new LoadImage(multiverseId, cardImageSize)).pipe(
        switchMapTo(this.cardImageFn$),
        map(cardImageFn => cardImageFn(multiverseId, cardImageSize))
      )),
      filter(url => typeof url === 'string'),
      distinctUntilChanged(),
      map((url: string) => this.createBackgroundStyle(url)),
      takeUntil(this._destroy$)
    ).subscribe(backgroundStyle => {
      this.cardBackground = backgroundStyle;
      this.change.markForCheck();
    });
  }

  private createBackgroundStyle(imageUrl: string) {
    return this.sanitizer.bypassSecurityTrustStyle(`url("${imageUrl}") no-repeat center center`);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
  }

}
