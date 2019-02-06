import { AngularFireAuth } from '@angular/fire/auth';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { auth, User as FirebaseUser } from 'firebase/app';
import { from } from 'rxjs';
import { catchError, delay, map, retryWhen } from 'rxjs/operators';
import { LoginType } from '../models/login-type.enum';
import * as AuthActions from './auth.state.actions';

export class AuthStateModel {
  public activeUser: FirebaseUser | null | undefined;
  public error: Error | null | undefined;
  public authUpdateError: Error | null | undefined;
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
      error: null
    });

    // Determine Login Method
    let authProvider: auth.AuthProvider;
    switch (loginType) {
      case LoginType.GOOGLE:
        authProvider = new auth.GoogleAuthProvider();
        break;
      default:
        return dispatch(new AuthActions.LoginFailure(new Error('Unkown login method')));
    }

    // Perform Login
    return from(this.afAuth.auth.signInWithPopup(authProvider)).pipe(
      map(userCredentials => userCredentials.user),
      map(user => user ?
        new AuthActions.LoginSuccess(user) :
        new AuthActions.LoginFailure(new Error('Guest login disabled'))
      ),
      catchError(error => dispatch(new AuthActions.LoginFailure(error)))
    );
  }

  @Action(AuthActions.UpdateAuthState, { cancelUncompleted: true })
  public updateAuthState({ dispatch }: StateContext<AuthStateModel>) {
    return this.afAuth.authState.pipe(
      map(activeUser => dispatch(new AuthActions.UpdateAuthStateSuccess(activeUser))),
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

  // Initialisation

  public ngxsOnInit({ dispatch }: StateContext<AuthState>) {
    return dispatch(new AuthActions.UpdateAuthState());
  }

}
