import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatGridListModule } from '@angular/material';
import { CardGridComponent } from './components/card-grid/card-grid.component';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorKeyPipe } from './pipes/error-key.pipe';

@NgModule({
  declarations: [ CardGridComponent, ErrorKeyPipe ],
  exports: [
    TranslateModule,
    CardGridComponent,
    ErrorKeyPipe
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatGridListModule
  ]
})
export class SharedModule { }
