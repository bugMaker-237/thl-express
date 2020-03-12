import { PressingComponent } from './pressing/pressing.component';
import { PressingListComponent } from './pressing/pressing-list/pressing-list.component';
import { PressingNewComponent } from './pressing/pressing-new/pressing-new.component';
import { ProfilComponent } from './profil/profil.component';
import { MapComponent } from './map/map.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';

import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { VerifyCodeComponent } from './auth/verify-code/verify-code.component';
import { Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { HistoryListComponent } from './history/history-list/history-list.component';
import { HistoryDetailsComponent } from './history/history-details/history-details.component';
import { ComplainComponent } from './complain/complain.component';
import { PayServiceComponent } from './pay-service/pay-service.component';
import { PacketComponent } from './Packet/Packet.component';
import { historyRoute, historyResolvers } from './history/routes';
import { pressingRoutes, pressingResolvers } from './pressing/routes';
import { HistoryService } from './history/history.service';
import { PressingService } from './pressing/pressing.service';

export const pages = [
  SignInComponent,
  SignUpComponent,
  VerifyCodeComponent,
  ProfilComponent,
  MapComponent,
  PressingComponent,
  PressingListComponent,
  PressingNewComponent,
  HistoryComponent,
  HistoryDetailsComponent,
  HistoryListComponent,
  ComplainComponent,
  PayServiceComponent,
  PacketComponent
];
export const resolvers = [...historyResolvers, ...pressingResolvers];
export const providers = [HistoryService, PressingService];
export const authRoutes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'verify-code', component: VerifyCodeComponent }
];

export const appRoutes: Routes = [
  {
    path: 'map/:type',
    component: MapComponent
  },
  {
    path: 'profil',
    component: ProfilComponent
  },
  {
    path: 'complain',
    component: ComplainComponent
  },
  {
    path: 'pay-service',
    component: PayServiceComponent
  },
  {
    path: 'packet',
    component: PacketComponent
  },
  pressingRoutes,
  historyRoute
];
