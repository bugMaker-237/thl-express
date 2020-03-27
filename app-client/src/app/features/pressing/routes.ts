import { Route } from '@angular/router';
import { PressingNewComponent } from './pressing-new/pressing-new.component';
import { PressingComponent } from './pressing.component';
import { PressingListComponent } from './pressing-list/pressing-list.component';
import { PressingListResolver } from './pressing-list/pressing-list.resolver';
import { PressingListClothsResolver } from './pressing-new/pressing-list-cloths.resolver';

export const pressingRoutes = {
  path: 'pressing',
  component: PressingComponent,
  children: [
    {
      path: 'list',
      component: PressingListComponent,
      resolve: {
        pressings: PressingListResolver
      }
    },
    {
      path: 'new',
      component: PressingNewComponent,
      resolve: {
        clothTypes: PressingListClothsResolver
      }
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]
} as Route;
export const pressingResolvers = [
  PressingListResolver,
  PressingListClothsResolver
];
