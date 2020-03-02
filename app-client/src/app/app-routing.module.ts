import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { AppShellComponent } from '@app.shared/components';
import { authRoutes, appRoutes } from './features';

const routes: Routes = [
  { path: '', redirectTo: '/sign-in', pathMatch: 'full' },
  ...authRoutes,
  {
    path: 'app-shell',
    component: AppShellComponent,
    children: [
      { path: '', redirectTo: '/app-shell/home', pathMatch: 'full' },
      ...appRoutes
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
