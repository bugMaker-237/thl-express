import { parse } from 'url';
import { HttpRequest } from '@angular/common/http';

export abstract class BaseInterceptor {
  protected appDomains: Array<string | RegExp> = [];
  protected anonymousRoutes: Array<string | RegExp> = [];
  protected unCachableRoutes: Array<string | RegExp> = [];

  protected isAppDomain(request: HttpRequest<any>): boolean {
    const requestUrl: any = parse(request.url, false, true);
    // console.log(requestUrl);
    return (
      requestUrl.host === null ||
      this.appDomains.findIndex(domain =>
        typeof domain === 'string'
          ? domain === requestUrl.host
          : domain instanceof RegExp
          ? domain.test(requestUrl.host)
          : false
      ) > -1
    );
  }

  protected isAnonymousRoute(request: HttpRequest<any>): boolean {
    const requestUrl: any = parse(request.url, false, true);
    return (
      this.anonymousRoutes.findIndex(route =>
        typeof route === 'string'
          ? requestUrl.path.startsWith(route)
          : route instanceof RegExp
          ? route.test(requestUrl.path)
          : false
      ) > -1
    );
  }

  protected isUnCachableRoutes(request: HttpRequest<any>): boolean {
    const requestUrl: any = parse(request.url, false, true);
    return (
      this.unCachableRoutes.findIndex(route =>
        typeof route === 'string'
          ? requestUrl.path.startsWith(route)
          : route instanceof RegExp
          ? route.test(requestUrl.path)
          : false
      ) > -1
    );
  }
}
