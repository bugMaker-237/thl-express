import { InjectionToken, inject, Injector, Injectable } from '@angular/core';
import { Router, NavigationExtras, UrlTree } from '@angular/router';

type ExtendedNavigationOptions = NavigationExtras & {
  clearHistory?: boolean;
  animated?: boolean;
  transition?: [];
};
export interface IApplicationRoute {
  router?: Router;
  navigate(
    commands: any[],
    extras?: ExtendedNavigationOptions
  ): Promise<boolean>;
  navigateByUrl(
    url: string | UrlTree,
    options?: ExtendedNavigationOptions
  ): Promise<boolean>;
}

@Injectable()
class ApplicationRouter {
  constructor(private inj: Injector) {}
  public get router(): Router {
    return this.inj.get(Router);
  }
}

const injector: Injector = Injector.create({
  providers: [
    {
      provide: Router,
      deps: [Injector]
    }
  ]
});

export const AppRouter: IApplicationRoute = injector.get(ApplicationRouter)
  .router;

export let APP_ROUTER = new InjectionToken<IApplicationRoute>('app.router', {
  providedIn: 'root',
  factory: () => AppRouter
});
