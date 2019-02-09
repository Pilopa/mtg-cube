import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { AuthState } from '../../state/auth.state';
import { User as FirebaseUser } from 'firebase/app';
import { Observable } from 'rxjs';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as AuthActions from '@app/auth/state/auth.state.actions';
import { LoginType } from '../../models/login-type.enum';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {

  @Select(AuthState.getActiveUser)
  readonly activeUser$: Observable<FirebaseUser | null | undefined>;

  @Select(AuthState.getError)
  readonly error$: Observable<Error | null | undefined>;

  @Select(AuthState.getPendingRequest)
  readonly pendingRequest$: Observable<'login' | 'logout' | null | undefined>;

  @Dispatch()
  public readonly loginGoogle = () => new AuthActions.Login(LoginType.GOOGLE)

  constructor(public readonly store: Store) { }

}
