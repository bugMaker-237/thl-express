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

  public getFullUrl(part: string) {
    if (!part.startsWith('/')) {
      part = '/' + part;
    }
    return this.config.apiEndpoints.only.serviceHost + part;
  }
  protected get loader(): Loader {
    return this.loaderRegistry.get('auth-loader');
  }

  public signIn(credentials: {
    email: string;
    password: string;
    code?: number | string;
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

  public resendCode() {
    return this.post<{ code: number | string; codeExpires: Date }>(
      `/resend/${this._user.id}`
    ).pipe(
      map((codeInfo) => {
        this._user.verify_code = codeInfo.code as number;
        this._user.code_expire = codeInfo.codeExpires;
        this.storage.set(this.localStorageKey, this._user);
      })
    );
  }

  public signOut(): Observable<{}> {
    return this.get<{ user: IUser }>('/logout').pipe(
      map((res) => {
        this.storage.remove(this.localStorageKey);
        this._user = null;
        return res;
      })
    );
  }

  public setUserInfos(newInfos: any) {
    const { token, ...infos } = newInfos;
    let user = this.connectedUser;
    user = Object.assign(user, infos);
    user.image = (user.driver || {}).picture || (user.client || {}).picture;
    this.storage.set(this.localStorageKey, user);
    this._user = user;
    console.log(JSON.stringify(user, null, 2));
  }

  public get connectedUser(): IUser {
    this._user =
      this._user || this.storage.getObject<IUser>(this.localStorageKey);
    return this._user;
  }

  public get token(): string {
    const user = this.storage.getObject<IUser>(this.localStorageKey);
    // console.log(user);
    return user ? user.token : '';
  }
  public async getUser(): Promise<IUser> {
    if (this._user) {
      return this._user;
    }

    return await this.storage.getObjectAsync<IUser>(this.localStorageKey);
  }

  public clearUser(): void {
    return this.storage.remove(this.localStorageKey);
  }

  private saveUser(data: { user: IUser }) {
    if (!data.user) {
      this.toastService.push({
        text: 'Compte ou mot de passe incorrect',
        persist: true,
        timeout: 5000,
      });
      throw new Error('Compte ou mot de passe incorrect');
    } else {
      this._user = data.user;
      this.storage.set(this.localStorageKey, data.user);
      return data;
    }
  }
}
