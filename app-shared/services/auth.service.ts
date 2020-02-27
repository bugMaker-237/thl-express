import { HttpService, Loader } from '@apps.common/services';
import { Observable, of } from 'rxjs';
import { IUser } from '@apps.common/models/user';
import { Injectable, Inject } from '@angular/core';
import { LoaderRegistrationService } from '@apps.common/services';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, IAppConfig } from '@apps.common/config';
import { Subject } from 'rxjs';
import { GenericSubjects, LocalStorageService } from '@apps.common/services';
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
    genericSubjects.add<boolean>('authenticationStatus$');
  }

  protected get loader(): Loader {
    return this.loaderRegistry.get('auth-loader');
  }

  public signIn(credentials: {
    username: string;
    password: string;
  }): Observable<IUser> {
    return this.post('sign-in', credentials);
  }

  public checkUsername(username: string): Observable<IUser> {
    return this.post('sign-in', { username });
  }
  public signOut(token: string): Observable<void> {
    this.storage.remove(this.localStorageKey);
    return of<void>();
  }
  public signInWithSocials(socialId: string): Observable<IUser> {
    throw new Error('Method not implemented.');
  }

  public get connectedUser(): IUser {
    return this.storage.getObject<IUser>(this.localStorageKey);
  }

  public get token(): string {
    return this.storage.getObject<IUser>(this.localStorageKey).token;
  }
}
