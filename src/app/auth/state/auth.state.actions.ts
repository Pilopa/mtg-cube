import { FirebaseError } from 'firebase/app';
import { LoginType } from '../models/login-type.enum';
import { LoginCredentialsModel } from '../models/login-credentials.model';
import { AppError } from '@app/shared/models/error.model';
import { User } from '@app/auth/models/user.model';

export class Logout {
  static readonly type = '[Auth] Logout]';
}

export class LogoutSuccess {
  static readonly type = '[Auth] LogoutSuccess]';
}

export class LogoutFailure {
  static readonly type = '[Auth] LogoutFailure]';
  constructor(public readonly error: FirebaseError) {}
}

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public readonly loginType: LoginType, public readonly credentials?: LoginCredentialsModel) {}
}

export class LoginFailure {
  static readonly type = '[Auth] LoginFailure';
  constructor(public readonly error: FirebaseError | AppError) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] LoginSuccess';
  constructor(public readonly user: User | null) {}
}

export class UpdateAuthState {
  static readonly type = '[Auth] UpdateAuthState';
}

export class UpdateAuthStateFailure {
  static readonly type = '[Auth] UpdateAuthState Failure';
  constructor(public readonly error: FirebaseError) {}
}

export class UpdateAuthStateSuccess {
  static readonly type = '[Auth] UpdateAuthState Success';
  constructor(public readonly user: User | null) {}
}

