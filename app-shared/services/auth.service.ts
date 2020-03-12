import { HttpService, Loader, ToastService } from '@apps.common/services';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { LoaderRegistrationService } from '@apps.common/services';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '@apps.common/config';
import { GenericSubjects, LocalStorageService } from '@apps.common/services';
import { IUserRequest, IUser } from '../models';
import { BaseService } from './base.service';
@Injectable()
export class AuthService extends BaseService {
  private _user: IUser;
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected loaderRegistry: LoaderRegistrationService,
    protected genericSubjects: GenericSubjects,
    protected toastService: ToastService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(
      http,
      storage,
      'AUTH',
      toastService,
      config.apiEndpoints.only.servicePath
    );
  }

  protected get loader(): Loader {
    return this.loaderRegistry.get('auth-loader');
  }

  public signIn(credentials: {
    email: string;
    password: string;
  }): Observable<{ user: IUser }> {
    return this.post<{ user: IUser }>('/login', credentials).pipe(
      map(this.saveUser.bind(this))
    );
  }

  public register(req: IUserRequest): Observable<{ user: IUser }> {
    return this.post<{ user: IUser }>('/register', req).pipe(
      map(this.saveUser.bind(this))
    );
  }

  resendCode() {
    return this.post<{ code: string; codeExpires: Date }>(
      `/resend/${this._user.id}`
    ).pipe(
      map(codeInfo => {
        this._user.verify_code = codeInfo.code;
        this._user.code_expire = codeInfo.codeExpires;
        this.storage.set(this.localStorageKey, this._user);
      })
    );
  }

  public signOut(): Observable<void> {
    this.storage.remove(this.localStorageKey);
    this._user = null;
    return of<void>();
  }

  public get connectedUser(): IUser {
    this._user =
      this._user || this.storage.getObject<IUser>(this.localStorageKey);
    return this._user;
  }

  public get token(): string {
    const user = this.storage.getObject<IUser>(this.localStorageKey);
    return user ? user.token : '';
  }

  private saveUser(data: { user: IUser }) {
    this._user = data.user;
    this.storage.set(this.localStorageKey, data.user);
    return data;
  }
}
