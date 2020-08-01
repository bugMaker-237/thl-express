import { ICacheStorageService } from '@root/services/storage/interfaces';
import { IAppConfig } from '@root/config/app.config';

export async function cleanCache(
  config: IAppConfig,
  cacheService: ICacheStorageService
) {
  await cacheService.keys().then(cacheNames => {
    Promise.all(
      cacheNames.map(cacheName => {
        const cacheVersion = cacheName.split('@')[1];
        if (config.version > cacheVersion) {
          return cacheService.delete(cacheName);
        }
      })
    );
  });
}
