import {TranslateService} from '@ngx-translate/core';

export function createAppInitializer(translationService: TranslateService, localeId: string) {
  return async () => {
    // Set Default Language
    translationService.setDefaultLang('en');

    // Load Default Language
    await translationService.use('en').toPromise();

    // Load Browser Language
    // TODO: await translationService.use(translationService.getBrowserLang()).toPromise();
  };
}
