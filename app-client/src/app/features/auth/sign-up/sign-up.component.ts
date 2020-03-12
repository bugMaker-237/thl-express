import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { AuthService } from '@app.shared/services';
import { IUserRequest } from '@app.shared/models';
import { RouterExtensions } from 'nativescript-angular/router';
import { isEmail } from '@apps.common/utils';
import { GlobalStoreService } from '@apps.common/services';
@Component({
  selector: 'sign-up',
  moduleId: module.id,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  user: IUserRequest = {
    confirmPassword: '',
    email: '',
    phone: null,
    password: '',
    name: ''
  } as IUserRequest;
  formDisabled = false;
  viewPassword = false;
  constructor(
    private _authService: AuthService,
    private _router: RouterExtensions,
    private _store: GlobalStoreService
  ) {}

  ngOnInit(): void {}
  onReturnPress(event) {}
  register() {
    let email: any = this.user.email;
    if (!isEmail(this.user.email)) {
      this.user.phone = +this.user.email;
      delete this.user.email;
      email = this.user.phone;
    } else {
      delete this.user.phone;
    }
    console.log(this.user);
    this._authService.register(this.user).subscribe({
      next: () => {
        this._store.set('willing-user', {
          email,
          password: this.user.password
        });
        this._router.navigate(['../verify-code'], {
          transition: {
            name: 'slide'
          }
        });
      }
    });
  }
}
