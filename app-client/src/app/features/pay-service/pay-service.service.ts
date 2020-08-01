import { Injectable, Inject } from '@angular/core';
import { BaseService } from '@app.shared/services';
import { HttpClient } from '@angular/common/http';
import {
  LocalStorageService,
  ToastService,
  Loader,
} from '@apps.common/services';
import { IAppConfig, APP_CONFIG } from '@apps.common/config';
import { IPaymentRequest, IOngoingPayment } from './payment.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaymentService extends BaseService {
  checkState$ = new Subject<any>();
  constructor(
    protected http: HttpClient,
    protected storage: LocalStorageService,
    protected toastService: ToastService,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) {
    super(
      http,
      storage,
      'PAYMENT',
      toastService,
      config.apiEndpoints.client.servicePath
    );
  }

  protected get loader(): Loader {
    return Loader.default;
  }

  pay(
    ongoingPayment: IOngoingPayment,
    buyer: { firstName: string; lastName: string; phone: string }
  ) {
    const payment: IPaymentRequest = {
      journey: ongoingPayment.journeyId,
      pressing: ongoingPayment.pressingId,
      lastname: buyer.lastName,
      name: buyer.firstName,
      phone: buyer.phone,
      type: ongoingPayment.type,
    };
    return this.post<{ message: string; status: number; code: string }>(
      '/pay',
      payment
    );
  }
  checkTransaction(code: string) {
    const checkSubscription = this.get<any>(`/check/${code}`).subscribe({
      next: (val) => {
        checkSubscription.unsubscribe();
        this.checkState$.next(val);
      },
    });
    return this.checkState$.asObservable();
  }
}
