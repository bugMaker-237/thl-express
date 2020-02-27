import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { UserRequest } from '@app.shared/models';
@Component({
  selector: 'sign-up',
  moduleId: module.id,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  user: UserRequest = {
    confirmPassword: '',
    emailOrPhone: ' ',
    password: '',
    username: ''
  } as UserRequest;
  formDisabled = false;
  viewPassword = false;
  constructor(private page: Page) {}

  ngOnInit(): void {}
  onReturnPress(event) {}
  goBack() {}
}
