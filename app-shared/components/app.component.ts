import { Component, Inject } from '@angular/core';
import {
  setDefaultLoader,
  OnlineService,
  ToastService,
  GlobalStoreService,
  GenericSubjects,
} from '@apps.common/services';
import { SettingsService, ProfilService, AuthService } from '../services';
import {
  IAppTheme,
  APP_THEME,
  APP_CONFIG,
  IAppConfig,
} from '@apps.common/config';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  moduleId: module.id,
  template: '<page-router-outlet></page-router-outlet>',
  providers: [AuthService],
})
export class AppComponent {
  public static get appType() {
    return AppComponent._appType;
  }
  constructor(
    @Inject(APP_THEME) _theme: IAppTheme,
    @Inject(APP_CONFIG) _config: IAppConfig,
    _onlineService: OnlineService,
    toastService: ToastService,
    _settings: SettingsService,
    _store: GlobalStoreService,
    _genSubjects: GenericSubjects,
    _profilService: ProfilService,
    _authService: AuthService,
    _translate: TranslateService
  ) {
    _store.set('app-type', AppComponent.appType);
    setDefaultLoader({
      indicatorColor: _theme.primaryColor,
      backgroudColor: _theme.primaryForeColor,
    });

    _genSubjects.get('onlineStatus$').subscribe({
      next(val) {
        const options = {
          backgroundColor: 'accent',
          position: 'bottom',
          tapToDismiss: true,
          textColor: _theme.accentForeColor,
          yAxisOffset: 20,
        };
        if (!val) {
          toastService.push({
            text: `Vous n'êtes pas connecté`,
            persist: true,
            data: { ...options, backgroundColor: 'danger' },
          });
        } else {
          toastService.push({
            text: 'Connexion établie',
            persist: true,
            data: options,
          });
        }
      },
    });
    _settings.getSettings().subscribe({
      next: (settings) => {
        console.log(settings);
        _store.set('settings', settings);
      },
    });
    _translate.addLangs(['en', 'fr']);
    _translate.use('fr');
    _genSubjects.get('randomError$').subscribe({
      next: () => {
        const options = {
          backgroundColor: 'danger',
          position: 'center',
          tapToDismiss: true,
          textColor: _theme.accentForeColor,
          yAxisOffset: 20,
        };
        toastService.push({
          text: `Un problème est survenue. Veillez réessayer plus tard`,
          persist: true,
          data: options,
        });
      },
    });
  }

  public static _appType: 'client' | 'driver';
  static oneSignalTagPush: (key: string, value: string) => void = () => {};
  public static forType(val: 'client' | 'driver') {
    AppComponent._appType = val;
    return this;
  }
}
