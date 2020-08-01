import { InjectionToken } from '@angular/core';
import {
  CacheStorageService,
  SnackbarService,
  PwaService,
  CacheService
} from '@root/services/index.web';
import { ICacheStorageService } from '@root/services/storage/interfaces';
import { CacheStorageProvider } from '../providers.common';

const cacheStorage = new CacheStorageService();

export const Providers = [
  { provide: CacheStorageProvider, useValue: cacheStorage },
  SnackbarService,
  PwaService,
  CacheService
];
