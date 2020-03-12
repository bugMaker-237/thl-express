import { HistoryComponent } from './history.component';
import { HistoryListComponent } from './history-list/history-list.component';
import { HistoryDetailsComponent } from './history-details/history-details.component';
import { ComplainComponent } from '../complain/complain.component';
import { Route } from '@angular/router';
import { HistoryListResolver } from './history-list/history-list.resolver';
import { HistoryDetailsResolver } from './history-details/history-details.resolver';

export const historyRoute = {
  path: 'history/:type',
  component: HistoryComponent,
  children: [
    {
      path: 'list',
      component: HistoryListComponent,
      resolve: {
        histories: HistoryListResolver
      },
      runGuardsAndResolvers: 'always'
    },
    {
      path: 'details/:id',
      component: HistoryDetailsComponent,
      resolve: {
        itemAndMapRoute: HistoryDetailsResolver
      }
    },
    {
      path: 'complain',
      data: { isFragment: true },
      component: ComplainComponent
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]
} as Route;

export const historyResolvers = [HistoryListResolver, HistoryDetailsResolver];
