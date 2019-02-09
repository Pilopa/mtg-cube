import { AngularFireAuth } from '@angular/fire/auth';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { auth, FirebaseError } from 'firebase/app';
import { from, merge } from 'rxjs';
import { catchError, delay, map, retryWhen, tap, mergeMap } from 'rxjs/operators';
import { LoginType } from '../models/login-type.enum';
import * as AuthActions from './auth.state.actions';
import { AppError } from '@app/shared/models/error.model';
import { User } from '@app/auth/models/user.model';
import { transformFirebaseUser } from '../utils/transform-firebase-user';

export class AuthStateModel {
  public activeUser: User | null | undefined;
  public error: AppError | FirebaseError | null | undefined;
  public authUpdateError: AppError | FirebaseError | null | undefined;
  public pending: 'login' | 'logout' | null | undefined;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    activeUser: undefined,
    pending: undefined,
    error: undefined,
    authUpdateError: undefined
  }
})
export class AuthState implements NgxsOnInit {

  // Constructor

  constructor (
    private readonly afAuth: AngularFireAuth,
  ) { }

  // Getters

  @Selector()
  public static getActiveUser (state: AuthStateModel) { return state.activeUser; }

  @Selector()
  public static getError (state: AuthStateModel) { return state.error; }

  @Selector()
  public static getPendingRequest (state: AuthStateModel) { return state.pending; }

  // Setters

  @Action(AuthActions.Login, { cancelUncompleted: true })
  public login({ dispatch, patchState }: StateContext<AuthStateModel>, { loginType, credentials }: AuthActions.Login) {
    // Reset Error State
    patchState({
      pending: 'login',
      error: null
    });

    // Determine Login Method
    let authProvider: auth.AuthProvider;
    switch (loginType) {
      case LoginType.GOOGLE:
        authProvider = new auth.GoogleAuthProvider();
        break;
      default:
        return new AuthActions.LoginFailure({
          code: 'auth/unknown-login-method',
          message: 'Unknown login method'
        });
    }

    // Perform Login
    return from(this.afAuth.auth.signInWithPopup(authProvider)).pipe(
      map(userCredentials => userCredentials.user),
      mergeMap(user => dispatch(user ?
        new AuthActions.LoginSuccess(transformFirebaseUser(user)) :
        new AuthActions.LoginFailure({
          code: 'auth/no-guest-login',
          message: 'Guest login disabled'
        }))
      ),
      catchError(error => dispatch(new AuthActions.LoginFailure(error)))
    );
  }

  @Action(AuthActions.LoginSuccess)
  public loginSuccess({ patchState }: StateContext<AuthStateModel>, { user }: AuthActions.LoginSuccess) {
    patchState({
      activeUser: user,
      pending: null
    });
  }

  @Action(AuthActions.LoginFailure)
  public loginFailure({ patchState }: StateContext<AuthStateModel>, { error }: AuthActions.LoginFailure) {
    patchState({
      error: error,
      pending: null
    });
  }

  @Action(AuthActions.UpdateAuthState, { cancelUncompleted: true })
  public updateAuthState({ dispatch }: StateContext<AuthStateModel>) {
    return this.afAuth.authState.pipe(
      mergeMap(activeUser => dispatch(new AuthActions.UpdateAuthStateSuccess(transformFirebaseUser(activeUser)))),
      retryWhen(errors => errors.pipe(delay(5000)))
    );
  }

  @Action(AuthActions.UpdateAuthStateSuccess)
  public updateAuthStateSuccess({ patchState }: StateContext<AuthStateModel>, { user }: AuthActions.UpdateAuthStateSuccess) {
    patchState({
      activeUser: user,
      authUpdateError: null
    });
  }

  @Action(AuthActions.UpdateAuthStateFailure)
  public updateAuthStateFailure({ patchState }: StateContext<AuthStateModel>, { error }: AuthActions.UpdateAuthStateFailure) {
    patchState({
      authUpdateError: error
    });
  }

  @Action(AuthActions.Logout, { cancelUncompleted: true })
  public logout({ dispatch, patchState }: StateContext<AuthStateModel>, { }: AuthActions.Logout) {
    patchState({
      pending: 'logout',
      error: null
    });

    return from(this.afAuth.auth.signOut()).pipe(
      mergeMap(_ => dispatch(new AuthActions.LogoutSuccess())),
      catchError(error => dispatch(new AuthActions.LogoutFailure(error)))
    );
  }

  @Action(AuthActions.LogoutSuccess)
  public logoutSuccess({ patchState }: StateContext<AuthStateModel>, { }: AuthActions.LogoutSuccess) {
    patchState({
      activeUser: null,
      pending: null
    });
  }

  @Action(AuthActions.LogoutFailure)
  public logoutFailure({ patchState }: StateContext<AuthStateModel>, { error }: AuthActions.LogoutFailure) {
    patchState({
      error: error,
      pending: null
    });
  }

  // Initialisation

  public ngxsOnInit({ dispatch }: StateContext<AuthState>) {
    return dispatch(new AuthActions.UpdateAuthState());
  }

}
