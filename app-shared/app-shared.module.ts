import { NgModule, NO_ERRORS_SCHEMA, Inject } from '@angular/core';

import { APP_CONFIG, IAppConfig } from '@apps.common/config';
import { AuthService } from './services';
import { components } from './components';

import { CommonModule } from '@apps.common/modules';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';

import { registerElement } from 'nativescript-angular/element-registry';
import { DriverService } from './services/driver.service';

registerElement(
  'MapView',
  () => require('nativescript-google-maps-sdk').MapView
);

@NgModule({
  imports: [NativeScriptModule, CommonModule],
  declarations: [...components],
  exports: [...components],
  providers: [AuthService, DriverService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppSharedModule {
  constructor(
    @Inject(APP_CONFIG) config: IAppConfig,
    authService: AuthService
  ) {
    config.authorization.getToken = () => authService.token;
  }
}
