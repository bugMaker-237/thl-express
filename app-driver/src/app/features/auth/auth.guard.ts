import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@app.shared/services';
import { RouterExtensions } from 'nativescript-angular/router';
import { DialogService } from '@root/services/utils';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: RouterExtensions,
    private _dialogService: DialogService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const user = this._authService.connectedUser;
    // // console.log(user);
    let toNavigate = 'app-shell/journey';
    let res = true;
    if (!user) {
      toNavigate = 'auth/sign-in';
      res = false;
    } else {
      if (user.suspend || user.delete) {
        this._dialogService.alert('Votre compte à été suspendu ou supprimé!');
        toNavigate = 'auth/sign-in';
        res = false;
      }
    }
    if (!res) {
      this._router.navigate([toNavigate], { clearHistory: true });
    }
    return res;
  }
}
