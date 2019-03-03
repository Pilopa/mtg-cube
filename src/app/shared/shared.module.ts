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
import { CardIndexState } from './state/card-index/card-index.state';
import { CardImageState } from './state/card-image/card-image.state';
import { CardImageDirective } from './directives/card-image.directive';
import { CardDataState } from './state/card-data/card-data.state';

@NgModule({
  declarations: [ CardGridComponent, ErrorKeyPipe, BasePageComponent, CardImageDirective ],
  exports: [
    TranslateModule,
    CardGridComponent,
    CardImageDirective,
    BasePageComponent,
    ErrorKeyPipe,
    CommonModule,
    FlexLayoutModule
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgxsModule.forFeature([LayoutState, CardIndexState, CardImageState, CardDataState]),
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
