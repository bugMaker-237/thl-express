import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { GenericSubjects } from './generic-subjects.service';
import { interval, Subscription, from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { isOnline } from '@root/utils';
import {
  connectionType,
  getConnectionType,
  startMonitoring,
  stopMonitoring,
} from 'tns-core-modules/connectivity';
@Injectable({
  providedIn: 'root',
})
export class OnlineService implements OnDestroy {
  private onlineStatus$: Subject<boolean>;
  private maxInterval = 60;
  private interval = 1000;
  private intervalValue = 10;
  private intervalSubscription: Subscription;
  private nextIntervalToWait$: Subject<number>;
  private canStart: boolean = true;
  constructor(genericSubjects: GenericSubjects, private zone: NgZone) {
    this.onlineStatus$ = genericSubjects.add<boolean>('onlineStatus$');
    this.nextIntervalToWait$ = new Subject<number>();
    this.startWorker();
  }
  ngOnDestroy(): void {
    stopMonitoring();
  }

  public isOnline(): Observable<boolean> {
    return this.onlineStatus$.asObservable();
  }

  private async startWorker() {
    startMonitoring((newConnectionType) => {
      switch (newConnectionType) {
        case connectionType.none:
          console.log('Connection status changed to none');
          this.onlineStatus$.next(false);
          break;
        case connectionType.wifi:
        case connectionType.mobile:
        case connectionType.ethernet:
          console.log('Connection status changed to online');
          this.onlineStatus$.next(true);
          break;
        case connectionType.bluetooth:
          this.onlineStatus$.next(false);
          break;
        default:
          break;
      }
    });
  }
}
