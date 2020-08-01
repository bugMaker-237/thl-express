import { Injectable, Inject } from '@angular/core';
import { compose, Attachment } from 'nativescript-email';
import { APP_THEME, IAppTheme } from '@root/config';
@Injectable({ providedIn: 'root' })
export class MailService {
  constructor(@Inject(APP_THEME) private _appTheme: IAppTheme) {}
  compose(options: {
    subjectSuffix: string;
    body: string;
    cc?: string;
    bcc?: string;
    to: string;
    attachments?: Attachment[];
  }) {
    const { subjectSuffix, body, cc, bcc, to, attachments } = options;
    return compose({
      subject: `${this._appTheme.appDisplayName}-${subjectSuffix}`,
      attachments,
      bcc: bcc ? [bcc] : [],
      cc: cc ? [cc] : [],
      body,
      to: [to]
    });
  }
}
