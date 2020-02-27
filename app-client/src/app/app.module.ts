import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { AppComponent } from './app.component';
import { ItemsComponent } from './item/items.component';
import { ItemDetailComponent } from './item/item-detail.component';

import { AuthModule } from '@apps.common/modules';
import { CommonModule } from '@apps.common/modules';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';

import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { VerifyCodeComponent } from './pages/auth/verify-code/verify-code.component';
import { AppShellComponent } from './components/app-shell/app-shell.component';
@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, CommonModule, AppRoutingModule, AuthModule],
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemDetailComponent,
    SignInComponent,
    SignUpComponent,
    VerifyCodeComponent,
    AppShellComponent
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
