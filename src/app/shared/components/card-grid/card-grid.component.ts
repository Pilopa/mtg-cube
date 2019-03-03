import { Component, ChangeDetectionStrategy, Input, ContentChild, TemplateRef } from '@angular/core';
import { Select } from '@ngxs/store';
import { LayoutState } from '@app/shared/state/layout/layout.state';
import { Observable } from 'rxjs';
import { LayoutSize } from '@app/shared/models/layout-size.model';
import { map } from 'rxjs/operators';
import { CubeCardModel, CubeCardInstanceModel } from '../../models/firestore/cube-cards/cube-cards.model';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardGridComponent {

  @Input() cards: CubeCardModel[] | CubeCardInstanceModel[];

  @Select(LayoutState.getLayoutSize)
  layoutSize$: Observable<LayoutSize>;

  @ContentChild(TemplateRef) cardTemplate: TemplateRef<any>;

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
