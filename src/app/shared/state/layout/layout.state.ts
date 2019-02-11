import { State, Selector, NgxsOnInit, StateContext, Action } from '@ngxs/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { combineLatest } from 'rxjs';
import { LayoutSize } from '@app/shared/models/layout-size.model';
import * as LayoutActions from '@app/shared/state/layout/layout.state.actions';
import { createSelector } from '@ngxs/store';
import { NavSection } from '@app/shared/models/nav-item.model';
import { TemplateRef } from '@angular/core';
import { clone } from 'lodash-es';

export interface LayoutStateModel {
  size: LayoutSize;
  navVisible: boolean;
  toolbarVisible: boolean;
  sideContentVisible: boolean;
  toolbarTemplate: TemplateRef<any> | undefined | null;
  sideContentTemplate: TemplateRef<any> | undefined | null;
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

@State<LayoutStateModel>({
    name: 'layout',
    defaults: {
      size: LayoutSize.MEDIUM,
      navVisible: false,
      toolbarVisible: true,
      toolbarTemplate: undefined,
      sideContentVisible: false,
      sideContentTemplate: undefined,
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
  static getToolbarTemplate(state: LayoutStateModel) { return state.toolbarTemplate; }

  @Selector()
  static getSideContentTemplate(state: LayoutStateModel) { return state.sideContentTemplate; }

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

  @Action(LayoutActions.SetToolbarTemplate)
  setToolbarTemplate({ patchState }: StateContext<LayoutStateModel>, { template }: LayoutActions.SetToolbarTemplate) {
    patchState({
      toolbarTemplate: template
    });
  }

  @Action(LayoutActions.SetSideContentTemplate)
  setSideContentTemplate({ patchState }: StateContext<LayoutStateModel>, { template }: LayoutActions.SetSideContentTemplate) {
    patchState({
      sideContentTemplate: template
    });
  }

  @Action(LayoutActions.ResetPageLayout)
  resetPageLayout({ patchState }: StateContext<LayoutStateModel>, {}: LayoutActions.ResetPageLayout) {
    patchState({
      toolbarVisible: true,
      toolbarTemplate: null,
      sideContentVisible: false,
      sideContentTemplate: null,
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
