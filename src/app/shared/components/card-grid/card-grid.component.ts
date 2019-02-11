import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CubeCardModel } from '@app/shared/models/firestore/cubes/cube.model';
import { Select } from '@ngxs/store';
import { LayoutState } from '@app/shared/state/layout/layout.state';
import { Observable } from 'rxjs';
import { LayoutSize } from '@app/shared/models/layout-size.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardGridComponent {

  @Input() cards: CubeCardModel[] = (() => {
    const result: CubeCardModel[] = [];

    for (let i = 0; i < 150; i++) {
      result.push({
        id: `C${i}`
      });
    }

    return result;
  })();

  @Select(LayoutState.getLayoutSize)
  layoutSize$: Observable<LayoutSize>;

  readonly columnCount$ = this.layoutSize$.pipe(
    map(size => {
      switch (size) {
        case LayoutSize.SMALL:
          return 3;
        case LayoutSize.MEDIUM:
          return 6;
        case LayoutSize.LARGE:
          return 8;
        default:
          return 6;
      }
    })
  );

  readonly gutterSize$ = this.layoutSize$.pipe(
    map(size => {
      switch (size) {
        case LayoutSize.SMALL:
          return 1;
        case LayoutSize.MEDIUM:
          return 2;
        case LayoutSize.LARGE:
          return 4;
        default:
          return 2;
      }
    })
  );

  constructor() { }

}
