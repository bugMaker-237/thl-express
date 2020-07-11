import { NgModule, NO_ERRORS_SCHEMA, Inject, NgZone } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';
import { AppComponent } from '@app.shared/components';

import { CommonModule } from '@apps.common/modules';
import { AppSharedModule } from '@app.shared/app-shared.module';
import { AppShellComponent } from '@app.shared/components';
import { pages, resolvers, providers } from './features';
import { RouterExtensions } from 'nativescript-angular/router';
import { getOneSignalInstance } from '~/one-signal';
import { android } from 'tns-core-modules/application';

@NgModule({
  bootstrap: [AppComponent.forType('driver')],
  imports: [
    NativeScriptModule,
    AppSharedModule,
    CommonModule,
    AppRoutingModule,
    NativeScriptUIAutoCompleteTextViewModule,
  ],
  declarations: [AppComponent, AppShellComponent, ...pages],
  providers: [...resolvers, ...providers],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {
  constructor(private ngZone: NgZone, private router: RouterExtensions) {
    try {
      const onesignal = getOneSignalInstance({
        received: (notif) => {
          console.log(notif);
        },
        opened: (notif) => {
          console.log(notif);
          this.ngZone
            .run(() => this.router.navigate(['app-shell/journey']))
            .then();
        },
      });
      onesignal.init(android.nativeApp);
    } catch (error) {
      console.error(error);
    }
  }
}
