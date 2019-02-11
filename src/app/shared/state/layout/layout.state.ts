import { State, Selector, NgxsOnInit, StateContext, Action } from '@ngxs/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { combineLatest } from 'rxjs';
import { LayoutSize } from '@app/shared/models/layout-size.model';
import * as LayoutActions from '@app/shared/state/layout/layout.state.actions';
import { createSelector } from '@ngxs/store';
import { NavSection } from '@app/shared/models/nav-item.model';

export interface LayoutStateModel {
  size: LayoutSize;
  navVisible: boolean;
  toolbarVisible: boolean;
  sideContentVisible: boolean;
  baseNavSections: NavSection[];
  pageNavSections: NavSection[];
}

export const DEFAULT_NAVIGATION_SECTIONS: NavSection[] = [
  {
    orderValue: 0,
    title: 'Examples',
    children: [
      {
        label: 'Login',
        icon: 'account_box',
        path: 'login'
      },
      {
        label: 'Responsive Card List',
        icon: 'view_module',
        path: 'test'
      }
    ]
  }
];

export const DEFAULT_LAYOUT_STATE_MODEL: LayoutStateModel = {
  size: LayoutSize.MEDIUM,
  navVisible: false,
  sideContentVisible: false,
  toolbarVisible: true,
  baseNavSections: DEFAULT_NAVIGATION_SECTIONS,
  pageNavSections: []
};

@State<LayoutStateModel>({
    name: 'layout',
    defaults: DEFAULT_LAYOUT_STATE_MODEL
})
export class LayoutState implements NgxsOnInit {

  @Selector()
  static getLayoutSize(state: LayoutStateModel) { return state.size; }

  @Selector()
  static isNavVisible(state: LayoutStateModel) { return state.navVisible; }

  @Selector()
  static getNavSections(state: LayoutStateModel) {
    return [...state.baseNavSections, ...state.pageNavSections]
            .sort((a, b) => a.orderValue - b.orderValue);
  }

  static isLayoutSize(size: LayoutSize | LayoutSize[]) {
    return createSelector([LayoutState.getLayoutSize], (actualSize: LayoutSize) => {
      if (Array.isArray(size)) {
        return size.includes(actualSize);
      } else {
        return size === actualSize;
      }
    });
  }

  constructor(private readonly breakpointObserver: BreakpointObserver) { }

  @Action(LayoutActions.SetSize)
  setSize({ patchState }: StateContext<LayoutStateModel>, { size }: LayoutActions.SetSize) {
    patchState({
      size: size
    });
  }

  @Action(LayoutActions.SetNavVisible)
  setNavVisible({ patchState }: StateContext<LayoutStateModel>, { flag }: LayoutActions.SetNavVisible) {
    patchState({
      navVisible: flag
    });
  }

  @Action(LayoutActions.ResetPageLayout)
  resetPageLayout({ setState }: StateContext<LayoutStateModel>, {}: LayoutActions.ResetPageLayout) {
    setState(DEFAULT_LAYOUT_STATE_MODEL);
  }

  public ngxsOnInit({ dispatch }: StateContext<LayoutState>) {
    return combineLatest([
      this.breakpointObserver.observe([Breakpoints.XSmall]),
      this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.Medium]),
      this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge])
    ]).subscribe(([small, medium, large]) => {
      if (small.matches) {
        return dispatch(new LayoutActions.SetSize(LayoutSize.SMALL));
      } else if (medium.matches) {
        return dispatch(new LayoutActions.SetSize(LayoutSize.MEDIUM));
      } else if (large.matches) {
        return dispatch(new LayoutActions.SetSize(LayoutSize.LARGE));
      }
    });
  }

}
