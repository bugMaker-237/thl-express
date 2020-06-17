import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { alert } from 'tns-core-modules/ui/dialogs';
import { IUserRequest, IUser } from '@app.shared/models';
import { AuthService } from '@app.shared/services';
import { RouterExtensions } from 'nativescript-angular/router';
import {
  Loader,
  DialogService,
  LocalStorageService,
  ToastService,
} from '@apps.common/services';
@Component({
  selector: 'verify-code',
  moduleId: module.id,
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
})
export class VerifyCodeComponent implements OnInit {
  verificationCode: number;
  connectedUser: IUser = {} as any;
  formDisabled = false;
  constructor(
    private _dialogService: DialogService,
    private _authService: AuthService,
    private _router: RouterExtensions,
    private _storage: LocalStorageService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.connectedUser = this._authService.connectedUser;
  }

  resend() {
    this._authService.resendCode().subscribe({
      next: () => {
        this._toastService.push({
          text: 'Message renvoyé',
          data: {
            backgroundColor: 'accent',
          },
        });
      },
    });
  }

  verifyCode() {
    const user = this._authService.connectedUser;
    // console.log(user);
    const expireDate = new Date(user.code_expire.toString());
    if (expireDate.getTime() < new Date().getTime()) {
      this._dialogService.alert(
        'Votre code de vérification a expiré, essayez de le renvoyer.'
      );
    } else {
      // console.log(this.verificationCode);
      // console.log(user.verify_code);
      if (
        this.verificationCode.toString().trim() ===
        user.verify_code.toString().trim()
      ) {
        const userCon = this._storage.getObject('willing-user') as any;
        userCon.code = this.verificationCode.toString().trim();
        console.log(userCon);
        this._authService.signIn(userCon).subscribe({
          next: (_) => {
            Loader.default.show();
            this._router
              .navigate(['app-shell/map/VIP'], {
                transition: {
                  name: 'slide',
                },
                clearHistory: true,
              })
              .then((__) => Loader.default.hide());
          },
        });
      } else {
        this._dialogService.alert('Code de vérification incorrect!');
      }
    }
  }
  cancel() {
    this._authService.clearUser();
    this._router.navigate(['auth/sign-in'], {
      transition: {
        name: 'slide',
      },
      clearHistory: true,
    });
  }
}
