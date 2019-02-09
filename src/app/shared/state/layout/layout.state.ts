import { State, Selector, NgxsOnInit, StateContext, Action } from '@ngxs/store';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { combineLatest } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { LayoutSize } from '@app/shared/models/layout-size.model';
import * as LayoutActions from '@app/shared/state/layout/layout.state.actions';
import { AppError } from '@app/shared/models/error.model';
import { createSelector } from '@ngxs/store';

export interface LayoutStateModel {
  size: LayoutSize;
}

@State<LayoutStateModel>({
    name: 'layout',
    defaults: {
      size: LayoutSize.MEDIUM
    }
})
export class LayoutState implements NgxsOnInit {

  @Selector()
  static getLayoutSize(state: LayoutStateModel) { return state.size; }

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

  public ngxsOnInit({ dispatch }: StateContext<LayoutState>) {
    return combineLatest([
      this.breakpointObserver.observe([Breakpoints.XSmall]),
      this.breakpointObserver.observe([Breakpoints.Small]),
      this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
    ]).pipe(
      mergeMap(([small, medium, large]) => {
        if (small.matches) {
          return dispatch(new LayoutActions.SetSize(LayoutSize.SMALL));
        } else if (medium.matches) {
          return dispatch(new LayoutActions.SetSize(LayoutSize.MEDIUM));
        } else if (large.matches) {
          return dispatch(new LayoutActions.SetSize(LayoutSize.LARGE));
        } else {
          throw {
            code: 'layout/unknown-layout-size',
            message: 'Unknown layout size'
          } as AppError;
        }
      })
    );
  }

  @Action(LayoutActions.SetSize)
  setSize({ patchState }: StateContext<LayoutStateModel>, { size }: LayoutActions.SetSize) {
    patchState({
      size: size
    });
  }

}
