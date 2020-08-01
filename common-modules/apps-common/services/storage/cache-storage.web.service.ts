import { Injectable } from '@angular/core';
import {
    HttpResponse,
    HttpRequest
} from '@angular/common/http';
import { CacheService } from './cache.web.service';
import { ICacheStorageService, ICacheService } from './interfaces/i.cache.service';

@Injectable()
export class CacheStorageService implements ICacheStorageService {
    private cacheStorage: CacheStorage;
    constructor() {
        this.cacheStorage = caches;
    }

    delete(cacheName: string): Promise<boolean> {
        return this.cacheStorage.delete(cacheName);
    }
    has(cacheName: string): Promise<boolean> {
        return this.cacheStorage.has(cacheName);
    }
    keys(): Promise<string[]> {
        return this.cacheStorage.keys();
    }
    match(request: HttpRequest<any>): Promise<HttpResponse<any>> {
        return this.cacheStorage.match(request.url).then(resp => {
            const newResp = new HttpResponse({
                body: resp.body,
                status: resp.status,
                statusText: resp.statusText,
                url: resp.url
            });
            resp.headers.forEach((val, key) => {
                newResp.headers.set(key, val);
            });
            return newResp;
        });
    }
    open(cacheName: string): Promise<ICacheService> {
        return this.cacheStorage.open(cacheName).then(c => new CacheService(c));
    }
}