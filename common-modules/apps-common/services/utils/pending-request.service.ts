import { Injectable } from '@angular/core';
import { LocalStorageService } from '@root/services/storage';
import { IPendingRequest } from '@root/models/utils/pending-request';
import { Subject } from 'rxjs';
import {
  IObservableArray,
  ObservableArrayEvent
} from '@root/utils/i.observable-array';
import { ObservableArray } from '@root/utils/observable-array';
@Injectable({
  providedIn: 'root'
})
export class PendingRequestService {
  [n: number]: IPendingRequest;
  length: number;
  private requestArray: IObservableArray<IPendingRequest>;
  public requestAdded$: Subject<IPendingRequest | IPendingRequest[]>;
  constructor(private storage: LocalStorageService) {
    this.requestArray =
      this.storage.getObject('pending-request') ||
      new ObservableArray<IPendingRequest>();
    this.attachArrayEvents();
    this.requestAdded$ = new Subject<IPendingRequest | IPendingRequest[]>();
  }
  private attachArrayEvents() {
    this.requestArray.addEventListener('itemadded', this.onRequestArrayChanged);
    this.requestArray.addEventListener(
      'indexchanged',
      this.onRequestArrayChanged
    );
    this.requestArray.addEventListener(
      'itemremoved',
      this.onRequestArrayChanged
    );
    this.requestArray.addEventListener('itemmoved', this.onRequestArrayChanged);
    this.requestArray.addEventListener('itemset', this.onRequestArrayChanged);
  }
  private onRequestArrayChanged(event: ObservableArrayEvent<IPendingRequest>) {
    this.storage.set('pending-request', this.requestArray);
    // this.requestAdded$.next(this.requestArray);
  }
  public get requests() {
    return this.requestArray;
  }
  pop(): IPendingRequest {
    const popped = this.requestArray.pop();
    return popped;
  }

  push(...items: IPendingRequest[]): number {
    return this.requestArray.push(...items);
  }

  shift(): IPendingRequest {
    return this.requestArray.shift();
  }
  slice(start?: number, end?: number): IPendingRequest[] {
    return this.requestArray.slice(start, end);
  }
  sort(compareFn?: (a: IPendingRequest, b: IPendingRequest) => boolean): this {
    this.requestArray.sort(compareFn);
    return this;
  }

  splice(
    start: number,
    deleteCount?: number,
    ...items: IPendingRequest[]
  ): IPendingRequest[] {
    return this.requestArray.splice(start, deleteCount, ...items);
  }

  unshift(...items: IPendingRequest[]): number {
    return this.requestArray.unshift(...items);
  }

  indexOf(searchElement: IPendingRequest, fromIndex?: number): number {
    return this.requestArray.indexOf(searchElement, fromIndex);
  }

  lastIndexOf(searchElement: IPendingRequest, fromIndex?: number): number {
    return this.requestArray.lastIndexOf(searchElement, fromIndex);
  }
  every(
    callbackfn: (
      value: IPendingRequest,
      index: number,
      array: IPendingRequest[]
    ) => unknown,
    thisArg?: any
  ): boolean {
    return this.requestArray.every(callbackfn);
  }
  some(
    callbackfn: (
      value: IPendingRequest,
      index: number,
      array: IPendingRequest[]
    ) => unknown,
    thisArg?: any
  ): boolean {
    return this.requestArray.some(callbackfn);
  }
  forEach(
    callbackfn: (
      value: IPendingRequest,
      index: number,
      array: IPendingRequest[]
    ) => void,
    thisArg?: any
  ): void {
    this.requestArray.forEach(callbackfn);
  }
  map<U>(
    callbackfn: (
      value: IPendingRequest,
      index: number,
      array: IPendingRequest[]
    ) => U,
    thisArg?: any
  ): U[] {
    return this.requestArray.map(callbackfn);
  }
  filter<S extends IPendingRequest>(
    callbackfn: (
      value: IPendingRequest,
      index: number,
      array: IPendingRequest[]
    ) => value is S,
    thisArg?: any
  ): S[] {
    return this.requestArray.filter(callbackfn);
  }

  reduce(
    callbackfn: (
      previousValue: IPendingRequest,
      currentValue: IPendingRequest,
      currentIndex: number,
      array: IPendingRequest[]
    ) => IPendingRequest
  ): IPendingRequest {
    return this.requestArray.reduce(callbackfn);
  }

  reduceRight(
    callbackfn: (
      previousValue: IPendingRequest,
      currentValue: IPendingRequest,
      currentIndex: number,
      array: IPendingRequest[]
    ) => IPendingRequest
  ): IPendingRequest {
    return this.requestArray.reduceRight(callbackfn);
  }

  find(
    predicate: (
      value: IPendingRequest,
      index: number,
      array: IObservableArray<IPendingRequest>
    ) => boolean,
    thisArg?: any
  ): IPendingRequest {
    return this.requestArray.find(predicate);
  }

  findIndex(
    predicate: (
      value: IPendingRequest,
      index: number,
      array: IObservableArray<IPendingRequest>
    ) => boolean,
    thisArg?: any
  ): IPendingRequest {
    return this.requestArray.findIndex(predicate);
  }
}
