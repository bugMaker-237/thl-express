import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { authRoutes, appRoutes } from './pages';

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
