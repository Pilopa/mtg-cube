// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  indexVersionHash: '91d56d60371a0984f6064b0f067c2f209082cbce',
  cardVersionHash: '66a90e1c9a34b96621face84cc26e655cc3e7945',
  firebase: {
    apiKey: 'AIzaSyDOt-nC9JsrgBVfocvGY7vgGWoB-WNoKoE',
    authDomain: 'mtg-cube.firebaseapp.com',
    databaseURL: 'https://mtg-cube.firebaseio.com',
    projectId: 'mtg-cube',
    storageBucket: 'mtg-cube.appspot.com',
    messagingSenderId: '600294721599'
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
