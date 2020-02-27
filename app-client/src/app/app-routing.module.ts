import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { VerifyCodeComponent } from './pages/auth/verify-code/verify-code.component';
import { AppShellComponent } from './components/app-shell/app-shell.component';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'verify-code', component: VerifyCodeComponent },
  { path: 'app-shell', component: AppShellComponent },
  // { path: 'items', component: ItemsComponent, canActivate: [AuthGuard] },
  // { path: 'item/:id', component: ItemDetailComponent },
  // {
  //     path: AUTH_ROUTES.AUTH,
  //     loadChildren: () => import('@apps.common/modules').then(m => m.AuthModule)
  // },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
