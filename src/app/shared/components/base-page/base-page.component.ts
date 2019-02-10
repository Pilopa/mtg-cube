import { Component, OnInit, ChangeDetectionStrategy, HostBinding, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LayoutState } from '@app/shared/state/layout/layout.state';
import { LayoutSize } from '@app/shared/models/layout-size.model';
import { Select } from '@ngxs/store';
import { Observable, Subject, combineLatest as CombineLatest } from 'rxjs';
import { map, takeUntil, combineLatest } from 'rxjs/operators';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as LayoutActions from '@app/shared/state/layout/layout.state.actions';

@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasePageComponent implements OnInit, OnDestroy {

  @HostBinding('class.small') isSmall: boolean;
  @HostBinding('class.medium') isMedium: boolean;
  @HostBinding('class.large') isLarge: boolean;

  @Select(LayoutState.getLayoutSize)
  layoutSize$: Observable<LayoutSize>;

  @Select(LayoutState.isLayoutSize(LayoutSize.SMALL))
  isSmall$: Observable<boolean>;

  @Select(LayoutState.isLayoutSize(LayoutSize.LARGE))
  isLarge$: Observable<boolean>;

  @Select(LayoutState.isNavVisible)
  isNavVisible$: Observable<boolean>;

  readonly sidenavMode$ = this.layoutSize$.pipe(
    map(size => size === LayoutSize.LARGE ? 'side' : 'over')
  );

  readonly isSideNavOpen$ = CombineLatest(this.isLarge$, this.isNavVisible$).pipe(
    map(([large, visible]) => large || visible)
  );

  readonly destroy$ = new Subject();

  @Dispatch()
  showNav = () => new LayoutActions.SetNavVisible(true)

  @Dispatch()
  hideNav = () => new LayoutActions.SetNavVisible(false)

  constructor(private readonly change: ChangeDetectorRef) { }

  ngOnInit() {
    this.layoutSize$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(size => {
      switch (size) {
        case LayoutSize.SMALL:
          this.isSmall = true;
          this.isMedium = false;
          this.isLarge = false;
          break;
        case LayoutSize.MEDIUM:
          this.isSmall = false;
          this.isMedium = true;
          this.isLarge = false;
          break;
        case LayoutSize.LARGE:
          this.isSmall = false;
          this.isMedium = false;
          this.isLarge = true;
          break;
        default:
          this.isSmall = false;
          this.isMedium = false;
          this.isLarge = false;
      }
      this.change.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

}
