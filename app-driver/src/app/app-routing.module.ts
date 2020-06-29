import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { AppShellComponent } from '@app.shared/components';
import { authRoutes, appRoutes } from './features';
import { AuthGuard } from './features/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/app-shell/journey', pathMatch: 'full' },
  {
    path: 'auth',
    // canActivate:
    children: [
      { path: '', redirectTo: '/auth/sign-in', pathMatch: 'full' },
      ...authRoutes,
    ],
  },
  {
    path: 'app-shell',
    canActivate: [AuthGuard],
    component: AppShellComponent,
    data: {
      isDriver: true,
    },
    children: [...appRoutes],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    NativeScriptRouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
