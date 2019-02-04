import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatGridListModule } from '@angular/material';
import { CardGridComponent } from './components/card-grid/card-grid.component';

@NgModule({
  declarations: [ CardGridComponent ],
  exports: [ CardGridComponent ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatGridListModule
  ]
})
export class SharedModule { }
