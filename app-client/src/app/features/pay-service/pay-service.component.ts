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
import { repeat, take, catchError } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';

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
    phone: '+237',
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
        // console.log(res);
        const code = res.code;
        if (res.code && res.status === 200) {
          let intervalSubscription: Subscription;

          const paySubscription = this._payService
            .checkTransaction(code)
            .pipe(
              catchError((_) => {
                if (intervalSubscription) {
                  intervalSubscription.unsubscribe();
                }
                return _;
              })
            )
            .subscribe({
              next: (res2) => {
                // console.log(res2);
                this._toasService.push({
                  text: res2.message,
                  data: {
                    backgroundColor:
                      res2.status === 400
                        ? 'danger'
                        : res2.status === 600
                        ? 'accent'
                        : 'primary',
                  },
                });
                if (res2.status === 200) {
                  if (intervalSubscription) {
                    intervalSubscription.unsubscribe();
                  }
                  this._router.navigate([this.service.redirectUrl], {
                    transition: {
                      name: 'slide',
                    },
                    relativeTo: this._activatedRoute,
                  });
                } else if (res2.status === 400) {
                  this._router.navigateByUrl('', {
                    transition: {
                      name: 'slide',
                    },
                  });
                }
              },
            });

          intervalSubscription = interval(5 * 60 * 60 * 1000)
            .pipe(take(5))
            .subscribe({
              next: () => {
                this._payService.checkTransaction(code);
              },
            });
        } else {
          this._toasService.push({
            text: res.message,
          });
        }
      },
    });
  }
}
