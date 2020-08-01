import { InjectionToken } from '@angular/core';
import appTheme from '@root/../../app.theme.json';

export interface IAppTheme {
  appDisplayName?: string;
  primaryColor?: string;
  primaryDarkColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  warnColor?: string;
  dangerColor?: string;
  primaryForeColor?: string;
  secondaryForeColor?: string;
  accentForeColor?: string;
  warnForeColor?: string;
  dangerForeColor?: string;
}

export const AppTheme: IAppTheme = appTheme;

export let APP_THEME = new InjectionToken<IAppTheme>('app.theme', {
  providedIn: 'root',
  factory: () => AppTheme
});
