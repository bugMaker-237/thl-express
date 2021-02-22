import { IPlace } from '@apps.common/models';

export interface IOngoingPayment {
  type: 'journey' | 'pressing';
  journeyId?: any;
  pressingId?: any;
  origin: IPlace;
  destination: IPlace;
  price: number;
  redirectUrl: string;
  transactionType: string;
}

export interface IPaymentRequest {
  name: string;
  lastname: string;
  phone: string;
  journey: any;
  pressing: any;
  type: 'journey' | 'pressing';
  transactiontype: string;
}
