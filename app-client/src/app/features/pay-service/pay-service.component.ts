import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app.shared/services';
import {
  GlobalStoreService,
  ToastService,
  Loader,
} from '@apps.common/services';
import { IOngoingPayment } from './payment.model';
import { PaymentService } from './pay-service.service';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { repeat, take } from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: 'pay-service',
  templateUrl: 'pay-service.component.html',
  styleUrls: ['pay-service.component.scss'],
  providers: [PaymentService],
})
export class PayServiceComponent implements OnInit {
  formDisabled = false;
  service: IOngoingPayment = { origin: {}, destination: {}, price: 0 } as any;
  buyer = {
    lastName: '',
    firstName: '',
    phone: '',
  };
  constructor(
    private _authService: AuthService,
    private _payService: PaymentService,
    private _activatedRoute: ActivatedRoute,
    private _router: RouterExtensions,
    private _store: GlobalStoreService,
    private _toasService: ToastService
  ) {}
  ngOnInit() {
    this.service = this._store.STORE.ONGOING_PAYMENT as IOngoingPayment;
    const user = this._authService.connectedUser;
    this.buyer = {
      lastName: user.name.split(' ')[0],
      firstName: user.name.split(' ')[1],
      phone: user.phone,
    };
  }
  pay() {
    if (this.buyer.phone.length < 9) {
      this._toasService.push({
        text: 'Numéro de téléphone incorrect',
        data: {
          backgroundColor: 'primary',
        },
      });
      return;
    }
    if (!/(\+)?237/.test(this.buyer.phone)) {
      this.buyer.phone = '+237' + this.buyer.phone;
    }
    if (!this.buyer.phone.startsWith('+')) {
      this.buyer.phone = '+' + this.buyer.phone;
    }
    this._payService.pay(this.service, this.buyer).subscribe({
      next: (res) => {
        this._toasService.push({
          text: res.message,
          data: {
            backgroundColor: 'primary',
          },
        });
        const code = res.code;
        if (res.code) {
          const intervalSubscription = interval(2000)
            .pipe(take(90))
            .subscribe({
              next: () => this._payService.checkTransaction(code),
            });

          this._payService.checkTransaction(code).subscribe({
            next: (res2) => {
              console.log(res2);
              if (res2.status === 200) {
                intervalSubscription.unsubscribe();
                this._router.navigate([this.service.redirectUrl], {
                  transition: {
                    name: 'slide',
                  },
                  relativeTo: this._activatedRoute,
                });
              }
            },
          });
        }
      },
    });
  }
}
