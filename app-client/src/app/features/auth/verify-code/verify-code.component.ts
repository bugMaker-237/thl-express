import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { alert } from 'tns-core-modules/ui/dialogs';
import { IUserRequest } from '@app.shared/models';
import { AuthService } from '@app.shared/services';
import { RouterExtensions } from 'nativescript-angular/router';
import { Loader, DialogService } from '@apps.common/services';
@Component({
  selector: 'verify-code',
  moduleId: module.id,
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnInit {
  verificationCode: string;
  formDisabled = false;
  constructor(
    private _dialogService: DialogService,
    private _authService: AuthService,
    private _router: RouterExtensions
  ) {}

  ngOnInit(): void {}

  resend() {
    this._authService.resendCode();
  }

  verifyCode() {
    const user = this._authService.connectedUser;
    if (user.code_expire < new Date()) {
      this._dialogService.alert(
        'Votre code de vérification a expiré, essayez de le renvoyer.'
      );
    } else {
      if (
        this.verificationCode === this._authService.connectedUser.verify_code
      ) {
        this._authService.signIn(history.state).subscribe({
          next: _ => {
            Loader.default.show();
            this._router
              .navigate(['app-shell/map'], {
                transition: {
                  name: 'slide'
                },
                clearHistory: true
              })
              .then(__ => Loader.default.hide());
          }
        });
      } else {
        this._dialogService.alert('Code de vérification incorrect!');
      }
    }
  }
}
