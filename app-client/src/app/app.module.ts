import { NgModule, NO_ERRORS_SCHEMA, Inject } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { AppComponent } from './app.component';

import { AuthModule } from '@apps.common/modules';
import { CommonModule } from '@apps.common/modules';
import { APP_CONFIG, IAppConfig } from '@apps.common/config';
import { AuthService } from '@root/services';
import { pages } from './pages';
import { components } from './components';

import { registerElement } from 'nativescript-angular/element-registry';

registerElement(
  'MapView',
  () => require('nativescript-google-maps-sdk').MapView
);
@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, CommonModule, AppRoutingModule, AuthModule],
  declarations: [AppComponent, ...components, ...pages],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
  constructor(
    @Inject(APP_CONFIG) config: IAppConfig,
    authService: AuthService
  ) {
    config.authorization.getToken = () => authService.token;
  }
}
