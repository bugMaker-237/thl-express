import { Injectable } from '@angular/core';
import { Subject, PartialObserver } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenericSubjects {
  private subjects$: {
    [x: string]: Subject<any>;
  } = {};
  constructor() {}

  public get<T>(name: string, registerIfNotExist = false): Subject<T> {
    const sub = this.subjects$[name] as Subject<T>;
    if (!sub && !registerIfNotExist) {
      throw new Error(`Subject not registered : ${name}`);
    } else if (!sub && registerIfNotExist) {
      return this.add(name);
    }
    return sub;
  }

  public add<T>(name: string): Subject<T> {
    this.subjects$[name] = this.subjects$[name] || new Subject<T>();
    return this.subjects$[name] as Subject<T>;
  }

  registerCommonSubjects(): void {
    this.add<boolean>('authenticationStatus$');
    this.add<boolean>('onlineStatus$');
    this.add<boolean>('noDataFoundStatus$');
    this.add<boolean>('randomError$');
  }
}
