import { PressingComponent } from './pressing/pressing.component';
import { PressingListComponent } from './pressing/pressing-list/pressing-list.component';
import { PressingNewComponent } from './pressing/pressing-new/pressing-new.component';
import { ProfilComponent } from './profil/profil.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';

import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { VerifyCodeComponent } from './auth/verify-code/verify-code.component';
import { Routes } from '@angular/router';

export const pages = [
  SignInComponent,
  SignUpComponent,
  VerifyCodeComponent,
  ProfilComponent,
  HomeComponent,
  PressingComponent,
  PressingListComponent,
  PressingNewComponent
];

export const authRoutes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'verify-code', component: VerifyCodeComponent }
];

export const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'profil',
    component: ProfilComponent
  },
  {
    path: 'pressing',
    component: PressingComponent,
    children: [
      {
        path: 'list',
        component: PressingListComponent
      },
      {
        path: 'new',
        component: PressingNewComponent
      }
    ]
  }
];
