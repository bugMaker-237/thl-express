import { HttpService, Loader } from '@apps.common/services';
import { Observable, of } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { LoaderRegistrationService } from '@apps.common/services';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '@apps.common/config';
import { GenericSubjects, LocalStorageService } from '@apps.common/services';
import { UserRequest, IUser } from '../models';
@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpService {
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected loaderRegistry: LoaderRegistrationService,
    protected genericSubjects: GenericSubjects,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(http, storage, 'AUTH', null, config.apiEndpoints.user.servicePath);
    // genericSubjects.add<boolean>('authenticationStatus$');
  }

  protected get loader(): Loader {
    return this.loaderRegistry.get('auth-loader');
  }

  public signIn(credentials: {
    username: string;
    password: string;
  }): Observable<IUser> {
    return this.post('login', credentials);
  }

  public register(req: UserRequest): Observable<IUser> {
    return this.post('register', req);
  }

  public signOut(token: string): Observable<void> {
    this.storage.remove(this.localStorageKey);
    return of<void>();
  }

  public get connectedUser(): IUser {
    return this.storage.getObject<IUser>(this.localStorageKey);
  }

  public get token(): string {
    return this.storage.getObject<IUser>(this.localStorageKey).token;
  }
}
