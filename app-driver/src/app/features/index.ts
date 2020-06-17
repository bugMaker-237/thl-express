import { ProfilComponent } from './profil/profil.component';
import { JourneyComponent } from './journey/journey.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';

import { Routes } from '@angular/router';
import { HistoryComponent } from './history/history.component';
import { HistoryListComponent } from './history/history-list/history-list.component';
import { HistoryDetailsComponent } from './history/history-details/history-details.component';
import { ComplainComponent } from '@app.shared/components';
import { historyRoute, historyResolvers } from './history/routes';
import { HistoryService } from './history/history.service';
import { DocumentsComponent } from './documents/documents.component';

export const pages = [
  SignInComponent,
  ProfilComponent,
  JourneyComponent,
  HistoryComponent,
  HistoryDetailsComponent,
  HistoryListComponent,
  ComplainComponent,
  DocumentsComponent,
];
export const resolvers = [...historyResolvers];
export const providers = [HistoryService];
export const authRoutes: Routes = [
  { path: 'sign-in', component: SignInComponent },
];

export const appRoutes: Routes = [
  {
    path: 'map/:type',
    component: JourneyComponent,
  },
  {
    path: 'profil',
    component: ProfilComponent,
  },
  {
    path: 'complain',
    component: ComplainComponent,
  },
  {
    path: 'documents',
    component: DocumentsComponent,
  },
  historyRoute,
];
