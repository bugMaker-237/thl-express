import { Injectable, Inject } from '@angular/core';
import { MessageService } from './message.service';
import {
  ToastDuration,
  ToastPosition,
  ToastyOptions
} from 'nativescript-toasty';

import { createToast } from './toast';
import { APP_THEME, IAppTheme } from '@root/config/app.theme';

@Injectable({
  providedIn: 'root'
})
export class ToastService extends MessageService {
  /**
   *
   */
  constructor(@Inject(APP_THEME) private _theme: IAppTheme) {
    super();
  }

  protected show(param: {
    text: string;
    timeout?: number;
    persist?: boolean;
    data?: any;
  }): void {
    let config = {
      backgroundColor: this._theme.dangerColor,
      position: ToastPosition.BOTTOM,
      tapToDismiss: true,
      textColor: this._theme.dangerForeColor,
      yAxisOffset: 20
    } as ToastyOptions;
    const options = (param.data
      ? Object.assign(config, this.parseConfig(param.data))
      : config) as ToastyOptions;
    options.text = param.text;
    options.duration =
      param.persist || param.timeout > 1000
        ? ToastDuration.LONG
        : ToastDuration.SHORT;

    createToast(options).show();
  }
  parseConfig(data: any): any {
    const config = Object.assign({}, data);
    switch (config.backgroundColor) {
      case 'primary':
        config.backgroundColor = this._theme.primaryColor;
        config.textColor = this._theme.primaryForeColor;
        break;
      case 'primary-dark':
        config.backgroundColor = this._theme.primaryDarkColor;
        config.textColor = this._theme.primaryForeColor;
        break;
      case 'accent':
        config.backgroundColor = this._theme.accentColor;
        config.textColor = this._theme.accentForeColor;
        break;
      case 'secondary':
        config.backgroundColor = this._theme.secondaryColor;
        config.textColor = this._theme.secondaryForeColor;
        break;
      case 'warn':
        config.backgroundColor = this._theme.warnColor;
        config.textColor = this._theme.warnForeColor;
        break;
      default:
        config.backgroundColor = this._theme.dangerColor;
        config.textColor = this._theme.dangerForeColor;
        break;
    }
    return config;
  }
}
