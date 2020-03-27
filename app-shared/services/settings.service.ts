import { BaseService } from './base.service';
import { HttpService, Loader } from '@apps.common/services';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { IPosition, stringifyCoordinates } from '@apps.common/models';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '@apps.common/config';
import { GenericSubjects, LocalStorageService } from '@apps.common/services';
import { IDriver } from '../models/driver';
import { Settings } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingsService extends BaseService {
  private _settings: Settings;
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected genericSubjects: GenericSubjects,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(
      http,
      storage,
      'SETTINGS',
      null,
      config.apiEndpoints.only.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  public get settings(): Settings {
    if (!this._settings) {
      this._settings = this.storage.getObject(this.localStorageKey);
    }
    return this._settings;
  }

  getSettings(): Observable<Settings> {
    return this.get<Settings>('/settings').pipe(
      map(s => {
        this.storage.set(this.localStorageKey, s);
        return s;
      })
    );
  }
}
