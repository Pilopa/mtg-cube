// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  indexVersionHash: '86bd566479ff14a60d4c5151ad34307e383f7663',
  cardVersionHash: 'd775e611a31e3b8243496b2e61cd61bfd10ed918',
  firebase: {
    apiKey: 'AIzaSyD3B5wKdnoB0yshJxbQv-_JFFNEEKiSpPk',
    authDomain: 'mtg-cube-dev.firebaseapp.com',
    databaseURL: 'https://mtg-cube-dev.firebaseio.com',
    projectId: 'mtg-cube-dev',
    storageBucket: 'mtg-cube-dev.appspot.com',
    messagingSenderId: '802482759052'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
