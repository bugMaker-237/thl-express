import { Component, Inject } from '@angular/core';
import {
  setDefaultLoader,
  OnlineService,
  ToastService,
  GlobalStoreService,
  GenericSubjects,
} from '@apps.common/services';
import { SettingsService } from '../services';
import {
  IAppTheme,
  APP_THEME,
  APP_CONFIG,
  IAppConfig,
} from '@apps.common/config';
import { knownFolders, Folder } from 'tns-core-modules/file-system';
@Component({
  selector: 'app-root',
  moduleId: module.id,
  template: '<page-router-outlet></page-router-outlet>',
})
export class AppComponent {
  constructor(
    @Inject(APP_THEME) _theme: IAppTheme,
    @Inject(APP_CONFIG) _config: IAppConfig,
    _onlineService: OnlineService,
    toastService: ToastService,
    _settings: SettingsService,
    _store: GlobalStoreService,
    _genSubjects: GenericSubjects
  ) {
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
        _store.set('settings', settings);
      },
    });
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
}
