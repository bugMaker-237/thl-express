import { CacheStorageService } from '@root/services';
import { CacheStorageProvider } from '../providers.common';

const cacheStorage = new CacheStorageService();

export const Providers = [
  { provide: CacheStorageProvider, useValue: cacheStorage }
];
