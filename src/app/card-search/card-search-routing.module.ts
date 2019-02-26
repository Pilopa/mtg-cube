import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardSearchPageComponent } from '@app/card-search/containers/card-search-page/card-search-page.component';
import { SharedModule } from '@app/shared/shared.module';
import { AuthModule } from '@app/auth/auth.module';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CardSearchPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  entryComponents: [ CardSearchPageComponent ]
})
export class CardSearchRoutingModule { }
