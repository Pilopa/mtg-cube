import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatGridListModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatListModule } from '@angular/material';
import { CardGridComponent } from './components/card-grid/card-grid.component';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorKeyPipe } from './pipes/error-key.pipe';
import { NgxsModule } from '@ngxs/store';
import { LayoutState } from './state/layout/layout.state';
import { BasePageComponent } from './components/base-page/base-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ CardGridComponent, ErrorKeyPipe, BasePageComponent ],
  exports: [
    TranslateModule,
    CardGridComponent,
    BasePageComponent,
    ErrorKeyPipe
  ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([LayoutState]),
    ScrollingModule,
    FlexLayoutModule,
    RouterModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule
  ]
})
export class SharedModule { }
