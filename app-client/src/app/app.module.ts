import { NgModule, NO_ERRORS_SCHEMA, Inject } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { AppComponent } from './app.component';

import { CommonModule } from '@apps.common/modules';
import { AppSharedModule } from '@app.shared/app-shared.module';
import { AppShellComponent } from '@app.shared/components';
import { pages } from './features';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppSharedModule,
    CommonModule,
    AppRoutingModule
  ],
  declarations: [AppComponent, AppShellComponent, ...pages],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
