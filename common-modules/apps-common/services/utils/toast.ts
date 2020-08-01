import { Toasty, ToastyOptions } from 'nativescript-toasty';

export function createToast(options: ToastyOptions) {
  return new Toasty(options);
}
