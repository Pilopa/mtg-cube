import { User as FirebaseUser } from 'firebase';
import { LoginType } from '../models/login-type.enum';
import { LoginCredentialsModel } from '../models/login-credentials.model';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public readonly loginType: LoginType, public readonly credentials?: LoginCredentialsModel) {}
}

export class LoginFailure {
  static readonly type = '[Auth] LoginFailure';
  constructor(public readonly error: Error) {}
}

export class LoginSuccess {
  static readonly type = '[Auth] LoginSuccess';
  constructor(public readonly user: FirebaseUser) {}
}

export class UpdateAuthState {
  static readonly type = '[Auth] UpdateAuthState';
}

export class UpdateAuthStateFailure {
  static readonly type = '[Auth] UpdateAuthState Failure';
  constructor(public readonly error: Error) {}
}

export class UpdateAuthStateSuccess {
  static readonly type = '[Auth] UpdateAuthState Success';
  constructor(public readonly user: FirebaseUser | null) {}
}

