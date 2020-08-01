import { HttpResponse, HttpRequest } from '@angular/common/http';

export interface ICacheStorageService {
  delete(cacheName: string): Promise<boolean>;
  has(cacheName: string): Promise<boolean>;
  keys(): Promise<string[]>;
  match(request: HttpRequest<any>): Promise<HttpResponse<any>>;
  open(cacheName: string): Promise<ICacheService>;
}

export interface ICacheService {
  add(request: HttpRequest<any>): Promise<void>;
  addAll(requests: HttpRequest<any>[]): Promise<void>;
  delete(request: HttpRequest<any>): Promise<boolean>;
  keys(request?: HttpRequest<any>): Promise<readonly HttpRequest<any>[]>;
  match(request: HttpRequest<any>): Promise<HttpResponse<any>>;
  matchAll(
    request?: HttpRequest<any>,
    options?: CacheQueryOptions
  ): Promise<readonly HttpResponse<any>[]>;
  put(request: HttpRequest<any>, response: HttpResponse<any>): Promise<void>;
}
