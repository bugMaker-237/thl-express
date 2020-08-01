import { InjectionToken } from '@angular/core';
import { IEndPoint } from './endpoint';
import appConfig from '@root/../../app.config.json';

export interface IAuthorization {
  appDomains: (RegExp | string)[];
  anonymousRoutes: (RegExp | string)[];
  authorizationHeaderName: string;
  authorizationScheme: string;
  throwNoTokenError: boolean;
  continueIfTokenExpired: boolean;
  getToken?: () => string | null | Promise<string | null>;
}
export interface IAppConfig {
  license: string;
  version: string;
  contacts: {
    support: string;
    issue: string;
    faq: string;
  };
  authorization: IAuthorization;
  apiEndpoints: {
    [x: string]: IEndPoint;
  };
  cacheConfig: {
    unCachableRoutes: (RegExp | string)[];
  };
}

export const AppConfig: IAppConfig = appConfig;

export let APP_CONFIG = new InjectionToken<IAppConfig>('app.config', {
  providedIn: 'root',
  factory: () => AppConfig
});
