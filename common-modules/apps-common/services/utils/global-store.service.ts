import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GlobalStoreService {
  public STORE: {
    [x: string]: any;
  } = {};
  constructor() {}

  remove(name: string | number) {
    delete this.STORE[name];
  }
  get<T extends any>(name: string | number) {
    return this.STORE[name] as T;
  }

  set(name: string | number, value: any) {
    this.STORE[name] = value;
  }
}
