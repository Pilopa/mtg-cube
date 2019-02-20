import { Component, OnInit, ChangeDetectionStrategy, HostBinding,
   OnDestroy, ChangeDetectorRef, Input, ViewEncapsulation } from '@angular/core';
import { LayoutState } from '@app/shared/state/layout/layout.state';
import { LayoutSize } from '@app/shared/models/layout-size.model';
import { Select } from '@ngxs/store';
import { Observable, Subject, combineLatest as CombineLatest } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as LayoutActions from '@app/shared/state/layout/layout.state.actions';
import { NavSection } from '@app/shared/models/nav-item.model';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BasePageComponent implements OnInit, OnDestroy {


  /**
   * Sets whether page content is vertically centered,
   * defaults to `false`.
   *
   * This can be used in conjunction with page layouts which do not require scrolling,
   * such as a centered card which displays static content (e.g. a login form).
   */
  @Input() contentCentered = false;

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

  @Select(LayoutState.getNavSections)
  navSections$: Observable<NavSection[]>;

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

  constructor(private readonly change: ChangeDetectorRef,
              private readonly scrollDispatcher: ScrollDispatcher) { }

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

    let prevScrollOffset = 0;
    this.scrollDispatcher.scrolled().pipe(
      takeUntil(this.destroy$)
    ).subscribe(scrollable => {
      if (scrollable) {
        const currentScrollPos = scrollable.measureScrollOffset('top');
        if (prevScrollOffset > currentScrollPos) {
          // TODO: Show toolbar
        } else {
          // TODO: Hide toolbar
        }
        prevScrollOffset = currentScrollPos;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

}
