import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginType } from '@app/auth/models/login-type.enum';
import { User } from '@app/auth/models/user.model';
import { AuthState } from '@app/auth/state/auth.state';
import * as AuthActions from '@app/auth/state/auth.state.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {

  @Select(AuthState.getActiveUser)
  readonly activeUser$: Observable<User | null | undefined>;

  @Select(AuthState.getError)
  readonly error$: Observable<Error | null | undefined>;

  @Select(AuthState.getPendingRequest)
  readonly pendingRequest$: Observable<'login' | 'logout' | null | undefined>;

  @Dispatch()
  public readonly loginGoogle = () => new AuthActions.Login(LoginType.GOOGLE)

  @Dispatch()
  public readonly logout = () => new AuthActions.Logout()

}
