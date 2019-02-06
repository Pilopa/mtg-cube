import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatCardModule, MatIconModule, MatDividerModule, MatButtonModule } from '@angular/material';
import { NgxsModule } from '@ngxs/store';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './containers/login-page/login-page.component';
import { AuthState } from './state/auth.state';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [LoginPageComponent],
  exports: [],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    FlexLayoutModule,
    AuthRoutingModule,
    AngularFireAuthModule,
    NgxsModule.forFeature([AuthState])
  ]
})
export class AuthModule { }
