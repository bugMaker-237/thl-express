import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { AuthService } from '@app.shared/services';
import { RouterExtensions } from 'nativescript-angular/router';
import {
  LoaderRegistrationService,
  Loader,
  DialogService,
} from '@apps.common/services';
import { IUser } from '@app.shared/models';

@Component({
  selector: 'sign-in',
  moduleId: module.id,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  username: string;
  password: string;
  formDisabled = false;
  viewPassword = false;
  constructor(
    private _authService: AuthService,
    private _dialogService: DialogService,
    private _router: RouterExtensions
  ) {}

  ngOnInit(): void {}
  login() {
    if (!this.username || !this.password) {
      this._dialogService.alert(
        "Veillez entrer l'email ou le numéro de téléphone et le mot de passe"
      );
      return;
    }
    this._authService
      .signIn({
        email: this.username,
        password: this.password,
      })
      .subscribe({ next: this.afterLogin.bind(this) });
  }

  afterLogin(data: { user: IUser }) {
    const u = data.user;
    Loader.default.show();
    if (u.suspend || u.delete || !u.active) {
      this._dialogService.alert('Votre compte à été suspendu ou supprimé!');
    } else {
      const toNavigate = '/';
      this._router
        .navigate([toNavigate], {
          transition: {
            name: 'slide',
          },
        })
        .then((_) => Loader.default.hide());
    }
  }
}
