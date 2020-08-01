import { ICacheService } from './interfaces/i.cache.service';
import { HttpResponse, HttpRequest } from '@angular/common/http';

export class CacheService implements ICacheService {
  add(request: HttpRequest<any>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  addAll(requests: HttpRequest<any>[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(request: HttpRequest<any>): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  keys(request?: HttpRequest<any>): Promise<readonly HttpRequest<any>[]> {
    throw new Error('Method not implemented.');
  }
  match(request: HttpRequest<any>): Promise<HttpResponse<any>> {
    throw new Error('Method not implemented.');
  }
  matchAll(
    request?: HttpRequest<any>,
    options?: CacheQueryOptions
  ): Promise<readonly HttpResponse<any>[]> {
    throw new Error('Method not implemented.');
  }
  put(request: HttpRequest<any>, response: HttpResponse<any>): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
