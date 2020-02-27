import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { UserRequest } from '@app.shared/models';
@Component({
  selector: 'verify-code',
  moduleId: module.id,
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnInit {
  verificationCode: string;
  formDisabled = false;
  constructor(private page: Page) {}

  ngOnInit(): void {}
  onReturnPress(event) {}
  goBack() {}
}
