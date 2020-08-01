import { HttpResponse, HttpRequest } from '@angular/common/http';
import {
  ICacheStorageService,
  ICacheService
} from './interfaces/i.cache.service';

export class CacheStorageService implements ICacheStorageService {
  delete(cacheName: string): Promise<boolean> {
    return Promise.resolve(false);
  }
  has(cacheName: string): Promise<boolean> {
    return Promise.resolve(false);
  }
  keys(): Promise<string[]> {
    return Promise.resolve([]);
  }
  match(request: HttpRequest<any>): Promise<HttpResponse<any>> {
    return Promise.resolve({} as any);
  }
  open(cacheName: string): Promise<ICacheService> {
    return Promise.resolve({} as any);
  }
}
