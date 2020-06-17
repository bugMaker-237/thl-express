import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { AuthService } from '@app.shared/services';
import { IUserRequest } from '@app.shared/models';
import { RouterExtensions } from 'nativescript-angular/router';
import { isEmail } from '@apps.common/utils';
import {
  GlobalStoreService,
  LocalStorageService,
  ToastService,
} from '@apps.common/services';
@Component({
  selector: 'sign-up',
  moduleId: module.id,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  user: IUserRequest = {
    confirmPassword: '',
    email: '',
    phone: null,
    password: '',
    name: '',
  } as IUserRequest;
  formDisabled = false;
  viewPassword = false;
  constructor(
    private _authService: AuthService,
    private _router: RouterExtensions,
    private _storage: LocalStorageService,
    private _toastService: ToastService
  ) {}

  ngOnInit(): void {
    // console.log(this._authService.connectedUser);
  }
  onReturnPress(event) {}
  register() {
    if (this.user.password !== this.user.confirmPassword) {
      this._toastService.push({
        text: 'Mot de passe et la confirmation du mot de passe sont différent',
        persist: true,
      });
    }
    if (!this.user.password) {
      this._toastService.push({
        text: 'Veillez saisir le mot de passe',
        persist: true,
      });
    }
    if (!this.user.name) {
      this._toastService.push({
        text: 'Le nom est obligatoire',
        persist: true,
      });
    }
    if (!this.user.email && !this.user.phone) {
      this._toastService.push({
        text: `Entrez soit l\'email, soit le numéro de téléphone`,
        persist: true,
      });
    }
    let email: any = this.user.email;
    if (!isEmail(this.user.email)) {
      this.user.phone = +this.user.email;
      delete this.user.email;
      email = this.user.phone.toString();
    } else {
      delete this.user.phone;
    }
    // console.log(this.user);
    this._authService.register(this.user).subscribe({
      next: () => {
        this._storage.set('willing-user', {
          email,
          password: this.user.password,
        });
        // console.log('in here...');
        this._router.navigate(['auth/verify-code'], {
          transition: {
            name: 'slide',
          },
        });
      },
    });
  }
}
