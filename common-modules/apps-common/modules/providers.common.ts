import {
  LoaderRegistrationService,
  LocalStorageService,
  JwtHelperService,
} from '@root/services';
import { InjectionToken } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '@root/interceptors';
import { RequestInterceptor } from '@root/interceptors/request.interceptor';
import { AppConfig, APP_CONFIG } from '@root/config/app.config';
import { APP_THEME, AppTheme } from '@root/config/app.theme';

import { ICacheStorageService } from '@root/services/storage/interfaces';

export const CacheStorageProvider = new InjectionToken<ICacheStorageService>(
  'CacheStorageProvider',
  { factory: () => ({} as any) }
);

export const CommonProviders = [
  LoaderRegistrationService,
  LocalStorageService,
  JwtHelperService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
  },
  // {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: RequestInterceptor,
  //   multi: true,
  // },
  { provide: APP_THEME, useValue: AppTheme },
  { provide: APP_CONFIG, useValue: AppConfig },
  { provide: CacheStorageProvider, useValue: {} as any },
];
