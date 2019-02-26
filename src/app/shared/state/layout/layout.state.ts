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
        label: 'nav.card-search',
        icon: 'image_search',
        path: '/cards/search'
      },
      {
        label: 'nav.login',
        icon: 'account_box',
        path: '/login'
      }
    ]
  }
];

@State<LayoutStateModel>({
    name: 'layout',
    defaults: {
      size: LayoutSize.MEDIUM,
      navVisible: false,
      toolbarVisible: true,
      sideContentVisible: false,
      baseNavSections: DEFAULT_NAVIGATION_SECTIONS,
      pageNavSections: []
    }
})
export class LayoutState implements NgxsOnInit {

  @Selector()
  static getLayoutSize(state: LayoutStateModel) { return state.size; }

  @Selector()
  static isNavVisible(state: LayoutStateModel) { return state.navVisible; }

  @Selector()
  static isSideContentVisible(state: LayoutStateModel) { return state.sideContentVisible; }

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

  @Action(LayoutActions.SetSideContentVisible)
  setSideContentVisible({ patchState }: StateContext<LayoutStateModel>, { flag }: LayoutActions.SetSideContentVisible) {
    patchState({
      sideContentVisible: flag
    });
  }

  @Action(LayoutActions.ToggleSideContentVisible)
  toggleSideContentVisible({ patchState, getState }: StateContext<LayoutStateModel>, { }: LayoutActions.ToggleSideContentVisible) {
    patchState({
      sideContentVisible: !getState().sideContentVisible
    });
  }

  @Action(LayoutActions.ResetPageLayout)
  resetPageLayout({ patchState }: StateContext<LayoutStateModel>, {}: LayoutActions.ResetPageLayout) {
    patchState({
      toolbarVisible: true,
      sideContentVisible: false,
      pageNavSections: []
    });
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
