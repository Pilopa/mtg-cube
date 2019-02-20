import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardGridComponent } from '@app/shared/components/card-grid/card-grid.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
