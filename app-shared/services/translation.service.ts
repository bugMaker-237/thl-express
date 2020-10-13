import { Injectable, Inject } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import {
  Loader,
  ToastService,
  GlobalStoreService,
} from '@apps.common/services';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '@apps.common/config';

@Injectable()
export class CustomTranslationLoader extends BaseService
  implements TranslateLoader {
  public static AppType: string;

  constructor(
    httpClient: HttpClient,
    toastService: ToastService,
    @Inject(APP_CONFIG) config: IAppConfig
  ) {
    super(
      httpClient,
      null,
      null,
      toastService,
      config.apiEndpoints.only.servicePath
    );
  }
  protected get loader(): Loader {
    return new Loader('@translate', { next: () => {} });
  }
  getTranslation(lang: string): Observable<any> {
    const base = CustomTranslationLoader.AppType;
    return this.get(`/${base}/languages/${lang}`);
  }
}
