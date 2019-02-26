import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as LayoutActions from '@app/shared/state/layout/layout.state.actions';

@Component({
  selector: 'app-card-search-page',
  templateUrl: './card-search-page.component.html',
  styleUrls: ['./card-search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardSearchPageComponent {

  @Dispatch()
  public readonly toggleSideContent = () => new LayoutActions.ToggleSideContentVisible()

  constructor() { }

}
