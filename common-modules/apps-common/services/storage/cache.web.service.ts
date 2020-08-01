import { map } from 'rxjs/operators';
import {
    HttpResponse,
    HttpRequest
} from '@angular/common/http';
import { ICacheService } from './interfaces/i.cache.service';

export class CacheService implements ICacheService {
    private cache: Cache;
    constructor(cache: Cache) {
        this.cache = cache;
    }
    add(request: HttpRequest<any>): Promise<void> {
        return this.cache.add(request.urlWithParams);
    }
    addAll(requests: HttpRequest<any>[]): Promise<void> {
        return this.cache.addAll(requests.map(r => r.urlWithParams));
    }
    delete(request: HttpRequest<any>): Promise<boolean> {
        return this.cache.delete(request.urlWithParams);
    }
    keys(request?: HttpRequest<any>): Promise<readonly HttpRequest<any>[]> {
        return this.cache.keys(request.urlWithParams).then(reqs => {
            return reqs.map(req => {
                const newReq = new HttpRequest(req.method, req.url, req.body);
                req.headers.forEach((val, key) => {
                    newReq.headers.set(key, val);
                });
                return newReq;
            })
        });
    }
    match(request: HttpRequest<any>): Promise<HttpResponse<any>> {
        return this.cache.match(request.urlWithParams).then(resp => {
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
    matchAll(request?: HttpRequest<any>, options?: CacheQueryOptions): Promise<readonly HttpResponse<any>[]> {
        return this.cache.matchAll(request.urlWithParams).then(resp => {
            return resp.map(r => {
                const newResp = new HttpResponse({
                    body: r.body,
                    status: r.status,
                    statusText: r.statusText,
                    url: r.url
                });
                r.headers.forEach((val, key) => {
                    newResp.headers.set(key, val);
                });
                return newResp;
            });
        });
    }
    put(request: HttpRequest<any>, response: HttpResponse<any>): Promise<void> {
        const resp = {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            body: response.body,
            url: response.url,
            headers: {}
        } as Response;
        response.headers.keys().forEach(key => {
            resp.headers[key] = response.headers[key];
        })
        return this.cache.put(request.urlWithParams, resp);
    }


}