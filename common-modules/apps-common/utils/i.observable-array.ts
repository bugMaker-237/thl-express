export interface IObservableArray<T> {
  [n: number]: T;
  length: number;
  [Symbol.iterator](): Iterable<T>;

  addEventListener(
    eventName: ObservableArrayEventType,
    handler: (event: ObservableArrayEvent<T>) => void
  ): void;
  removeEventListner(
    eventName: ObservableArrayEventType,
    handler: (event: ObservableArrayEvent<T>) => void
  ): void;
  push(...items: T[]): number;
  pop(): T | undefined;
  unshift(...items: T[]): number;
  shift(): T | undefined;
  spliceMiltiple(indices: number[]): void;
  splice(index?: number, deleteCount?: number, ...items: T[]): T[];
  sort(compareFn: (current: T, next: T) => boolean, asc?: boolean): void;
  move(oldIndex: number, newIndex: number): void;
  slice?(start?: number, end?: number): T[];
  indexOf?(searchElement: T, fromIndex?: number): number;
  lastIndexOf?(searchElement: T, fromIndex?: number): number;
  find?(
    predicate: (value: T, index: number, array: IObservableArray<T>) => boolean,
    thisArg?: any
  ): T | undefined;
  findIndex?(
    predicate: (value: T, index: number, array: IObservableArray<T>) => boolean,
    thisArg?: any
  ): T;

  every?(
    callbackfn: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): boolean;
  some?(
    callbackfn: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): boolean;
  forEach?(
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: any
  ): void;
  map?<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): U[];
  filter?<S extends T>(
    callbackfn: (value: T, index: number, array: T[]) => value is S,
    thisArg?: any
  ): S[];
  filter?(
    callbackfn: (value: T, index: number, array: T[]) => unknown,
    thisArg?: any
  ): T[];
  reduce?(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T
  ): T;
  reduce?(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T,
    initialValue: T
  ): T;
  reduce?<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => U,
    initialValue: U
  ): U;
  reduceRight?(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T
  ): T;
  reduceRight?(
    callbackfn: (
      previousValue: T,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => T,
    initialValue: T
  ): T;
  reduceRight?<U>(
    callbackfn: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: T[]
    ) => U,
    initialValue: U
  ): U;
}

export interface ObservableArrayEvent<T> {
  type: ObservableArrayEventType;
  index: number;
  oldIndex?: number;
  siblingHash?: string;
  sibling?: T;
  item: T;
}
export type ObservableArrayEventType =
  | 'itemset'
  | 'itemremoved'
  | 'itemadded'
  | 'indexchanged'
  | 'itemmoved';
