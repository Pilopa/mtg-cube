import { NgModule } from '@angular/core';

import { CardSearchRoutingModule } from './card-search-routing.module';
import { CardSearchPageComponent } from './containers/card-search-page/card-search-page.component';
import { SharedModule } from '@app/shared/shared.module';
import { AuthModule } from '@app/auth/auth.module';
import { MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  declarations: [CardSearchPageComponent],
  imports: [
    AuthModule,
    SharedModule,
    CardSearchRoutingModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class CardSearchModule { }
