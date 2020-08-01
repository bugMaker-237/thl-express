import { SelectionSortFunction, QuickSortFunction } from './sort-functions';
import {
  ObservableArrayEvent,
  ObservableArrayEventType,
  IObservableArray
} from './i.observable-array';

export class ObservableArray<T> implements IObservableArray<T> {
  [n: number]: T;
  private array: T[] = [];
  private handlers: any = {
    itemadded: [],
    itemremoved: [],
    itemset: [],
    indexchanged: [],
    itemmoved: []
  };
  constructor(...items: T[]) {
    Object.getOwnPropertyNames(Array.prototype).forEach(name => {
      if (!(name in this)) {
        Object.defineProperty(this, name, {
          configurable: false,
          enumerable: false,
          writable: false,
          value: Array.prototype[name]
        });
      }
    });
    this.push(...items);
  }
  [Symbol.iterator]() {
    console.log(this.array[Symbol.iterator]());
    return this.array[Symbol.iterator]();
  }
  addEventListener(
    eventName: ObservableArrayEventType,
    handler: (event: ObservableArrayEvent<T>) => void
  ) {
    this.handlers[eventName].push(handler);
  }
  removeEventListner(
    eventName: ObservableArrayEventType,
    handler: (event: ObservableArrayEvent<T>) => void
  ) {
    const h = this.handlers[eventName];
    let ln = h.length;
    while (--ln >= 0) {
      if (h[ln] === handler) {
        h.splice(ln, 1);
      }
    }
  }
  push(...items: T[]) {
    items = items || [];
    let index: number;
    for (let i = 0, ln = items.length; i < ln; i++) {
      index = this.array.length;
      items[i]['hash'] = Date.now().toString();
      this.array.push(items[i]);
      this.defineIndexProperty(index);
      this.raiseEvent({
        type: 'itemadded',
        index,
        item: items[i]
      });
    }
    return this.array.length;
  }
  pop(): T | undefined {
    if (this.array.length > -1) {
      const index = this.array.length - 1,
        item = this.array.pop();
      delete this[index];
      this.raiseEvent({
        type: 'itemremoved',
        index,
        item
      });
      return item;
    }
  }
  unshift(...items: T[]): number {
    for (let i = 0, ln = items.length; i < ln; i++) {
      this.array.splice(i, 0, items[i]);
      this.defineIndexProperty(this.array.length - 1);
      this.raiseEvent({
        type: 'itemadded',
        index: i,
        item: items[i]
      });
    }
    for (let i = 0; i < this.array.length; i++) {
      this.raiseEvent({
        type: 'indexchanged',
        index: i,
        item: this.array[i]
      });
    }
    return this.array.length;
  }

  shift(): T | undefined {
    if (this.array.length > -1) {
      const item = this.array.shift();
      delete this[this.array.length];
      this.raiseEvent({
        type: 'itemremoved',
        index: 0,
        item
      });
      return item;
    }
  }
  spliceMiltiple(indices: number[]) {
    const removed = [];
    let item: any;
    indices = indices.sort((a, b) => b - a);

    for (let i = 0; i < indices.length; i++) {
      item = this.array.splice(indices[i], 1);
      removed.push(item);
      delete this[this.array.length]; // removing the index property on the instance
      this.raiseEvent({
        type: 'itemremoved',
        index: i,
        item: item[0]
      });
    }
    return removed;
  }
  splice(index?: number, deleteCount?: number, ...items: T[]): T[] {
    let removed = [],
      item: any,
      pos: any;
    items = items || [];
    index = index == null ? 0 : index < 0 ? this.array.length + index : index;

    deleteCount =
      deleteCount == null
        ? this.array.length - index
        : deleteCount > 0
        ? deleteCount
        : 0;
    console.log('splice');

    while (deleteCount--) {
      item = this.array.splice(index, 1)[0];
      removed.push(item);
      delete this[this.array.length];
      this.raiseEvent({
        type: 'itemremoved',
        index: index + removed.length - 1,
        item
      });
    }

    for (let i = 0, ln = items.length; i < ln; i++) {
      this.array.splice(index, 0, items[i]);
      this.defineIndexProperty(this.array.length - 1);
      this.raiseEvent({
        type: 'itemadded',
        index,
        item: items[i]
      });
      index++;
    }

    return removed;
  }
  sort(compareFn: (current: T, next: T) => boolean, asc = true) {
    // const sortFn = asc ? compareFn :
    // (current: T, next: T) => !compareFn(current, next);

    if (this.array.length < 500) {
      SelectionSortFunction.sort(this.array, this.swap.bind(this), compareFn);
    } else {
      QuickSortFunction.sort(this.array, this.swap.bind(this), compareFn);
    }
  }

  private swap(index1: number, index2: number) {
    const temp = this.array[index2];
    this.array[index2] = this.array[index1];
    this.array[index1] = temp;
    this.raiseEvent({
      index: index2,
      item: this.array[index2],
      type: 'itemmoved',
      siblingHash: this.array[index1]['hash'],
      sibling: this.array[index1],
      oldIndex: index1
    });
  }

  move(old_index: number, new_index: number) {
    const arr = this.array;
    while (old_index < 0) {
      old_index += arr.length;
    }
    while (new_index < 0) {
      new_index += arr.length;
    }
    if (new_index >= arr.length) {
      let k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  }

  get length() {
    return this.array.length;
  }
  set length(value: number) {
    const n = value;
    const length = this.array.length;
    if (n % 1 === 0 && n >= 0) {
      if (n < length) {
        this.splice(n);
      } else if (n > length) {
        [].push.apply(this, new Array(n - length));
      }
    } else {
      throw new RangeError('Invalid array length');
    }
    this.array.length = n;
  }
  private defineIndexProperty(index: string | number | symbol) {
    const _self = this;
    if (!(index in _self)) {
      Object.defineProperty(_self, index, {
        configurable: true,
        enumerable: true,
        get() {
          return _self.array[index];
        },
        set(v) {
          _self.array[index] = v;
          this.raiseEvent({
            type: 'itemset',
            index,
            item: v
          });
        }
      });
    }
  }
  private raiseEvent(event: ObservableArrayEvent<T>) {
    const _self = this;
    this.handlers[event.type].forEach(function(h: {
      call: (arg0: any, arg1: any) => void;
    }) {
      h.call(_self, event);
    });
  }
}
