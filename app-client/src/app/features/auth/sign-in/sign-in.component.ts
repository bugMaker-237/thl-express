import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'sign-in',
  moduleId: module.id,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  username: string;
  password: string;
  formDisabled = false;
  viewPassword = false;
  constructor(private page: Page) {}

  ngOnInit(): void {}
  onReturnPress(event) {}
}
