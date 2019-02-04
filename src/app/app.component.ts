import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CubeCardModel } from '@app/shared/models/firebase/cubes/cube.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  cards = new BehaviorSubject<CubeCardModel[]>([]);

  constructor() {
    const cards: CubeCardModel[] = [];

    for (let i = 0; i < 1000; i++) {
      cards.push({
        id: `C${Math.random() * 1000}`
      });
    }

    this.cards.next(cards);
  }

}
