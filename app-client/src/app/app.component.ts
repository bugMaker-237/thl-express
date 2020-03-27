import { Component, Inject } from '@angular/core';
import {
  setDefaultLoader,
  OnlineService,
  ToastService,
  GlobalStoreService
} from '@apps.common/services';
import { SettingsService } from '@app.shared/services';
import {
  IAppTheme,
  APP_THEME,
  APP_CONFIG,
  IAppConfig
} from '@apps.common/config';
import { knownFolders, Folder } from 'tns-core-modules/file-system';
@Component({
  selector: 'app-root',
  moduleId: module.id,
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(
    @Inject(APP_THEME) _theme: IAppTheme,
    @Inject(APP_CONFIG) _config: IAppConfig,
    _onlineService: OnlineService,
    toastService: ToastService,
    _settings: SettingsService,
    _store: GlobalStoreService
  ) {
    setDefaultLoader({
      indicatorColor: _theme.primaryColor,
      backgroudColor: _theme.primaryForeColor
    });
    // // console.log(knownFolders.documents().path);
    // const folder = Folder.fromPath('/storage/emulated/0/thl-config');
    // if (folder) {
    //   const file = folder.getFile('app.config.json');
    //   if (file) {
    //     file
    //       .readText()
    //       .then(val => {
    //         if (val.length > 0) {
    //           const conf = JSON.parse(val) as IAppConfig;
    //           _config.apiEndpoints = conf.apiEndpoints;
    //           _config.authorization = conf.authorization;
    //           // console.log(_config);
    //         }
    //       })
    //       .catch(// console.log);
    //   }
    // }

    _onlineService.isOnline().subscribe({
      next(val) {
        const options = {
          backgroundColor: 'accent',
          position: 'bottom',
          tapToDismiss: true,
          textColor: _theme.accentForeColor,
          yAxisOffset: 20
        };
        if (!val) {
          toastService.push({
            text: "Vous n'êtes pas connecté",
            persist: true,
            data: options
          });
        } else {
          toastService.push({
            text: 'Connexion établie',
            persist: true,
            data: options
          });
        }
      }
    });
    _settings.getSettings().subscribe({
      next: settings => {
        _store.set('settings', settings);
      }
    });
  }
}
