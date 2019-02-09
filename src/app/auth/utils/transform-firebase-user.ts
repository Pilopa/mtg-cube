import { User as FirebaseUser } from 'firebase/app';
import { User } from '@app/auth/models/user.model';

export function transformFirebaseUser(firebaseUser: FirebaseUser | null): User | null {
  return firebaseUser ? {
    id: firebaseUser.uid,
    username: firebaseUser.displayName,
    email: firebaseUser.email
  } : null;
}
