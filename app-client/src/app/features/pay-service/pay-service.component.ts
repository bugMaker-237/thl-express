import { Component, OnInit } from '@angular/core';
import { IPlace } from '@apps.common/models';
import { AuthService } from '@app.shared/services';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from '@angular/router';
import { GlobalStoreService } from '@apps.common/services';

@Component({
  selector: 'pay-service',
  templateUrl: 'pay-service.component.html',
  styleUrls: ['pay-service.component.scss']
})
export class PayServiceComponent implements OnInit {
  formDisabled = false;
  service: {
    origin: IPlace;
    destination: IPlace;
    price: number;
  } = { origin: {}, destination: {}, price: 0 } as any;
  buyer = {
    lastName: '',
    firstName: '',
    phone: ''
  };
  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _store: GlobalStoreService
  ) {}
  ngOnInit() {
    this.service = this._store.get('ongoing-payment') as any;
    const user = this._authService.connectedUser;
    this.buyer = {
      lastName: user.name.split(' ')[0],
      firstName: user.name.split(' ')[1],
      phone: user.phone
    };
  }
}
