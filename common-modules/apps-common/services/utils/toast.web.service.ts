import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService extends MessageService {
  /**
   *
   */
  constructor(private snackBarRef: MatSnackBar) {
    super();
  }

  protected show(param: {
    text: string;
    timeout?: number;
    persist?: boolean;
    data?: any;
  }): void {
    const conf = new MatSnackBarConfig();
    conf.duration = param.timeout;
    this.snackBarRef.open(param.text, null, conf);
  }
}
