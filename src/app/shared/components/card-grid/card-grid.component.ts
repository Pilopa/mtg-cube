import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CubeCardModel } from '@app/shared/models/firebase/cubes/cube.model';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardGridComponent {

  @Input() cards: CubeCardModel[];

  constructor() { }


}
