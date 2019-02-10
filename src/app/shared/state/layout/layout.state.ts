import { State, Selector, NgxsOnInit, StateContext, Action } from '@ngxs/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { combineLatest } from 'rxjs';
import { LayoutSize } from '@app/shared/models/layout-size.model';
import * as LayoutActions from '@app/shared/state/layout/layout.state.actions';
import { createSelector } from '@ngxs/store';

export interface LayoutStateModel {
  size: LayoutSize;
  navVisible: boolean;
}

export const DefaultLayoutStateModel: LayoutStateModel = {
  size: LayoutSize.MEDIUM,
  navVisible: false
};

@State<LayoutStateModel>({
    name: 'layout',
    defaults: DefaultLayoutStateModel
})
export class LayoutState implements NgxsOnInit {

  @Selector()
  static getLayoutSize(state: LayoutStateModel) { return state.size; }

  @Selector()
  static isNavVisible(state: LayoutStateModel) { return state.navVisible; }

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

  public ngxsOnInit({ dispatch }: StateContext<LayoutState>) {
    return combineLatest([
      this.breakpointObserver.observe(Breakpoints.XSmall),
      this.breakpointObserver.observe(Breakpoints.Small),
      this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
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
