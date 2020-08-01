import { Subject, PartialObserver } from 'rxjs';

export class Loader {
  private static _default: Loader;
  name: string;
  private loaderState$: Subject<boolean>;
  constructor(name: string, observer: PartialObserver<boolean>) {
    this.loaderState$ = new Subject<boolean>();
    this.loaderState$.subscribe(observer);
    this.name = name;
  }
  public addSubscription(observer: PartialObserver<boolean>) {
    this.loaderState$.subscribe(observer);
  }
  public unSubscribe() {
    this.loaderState$.unsubscribe();
  }
  public show() {
    this.loaderState$.next(true);
  }

  public hide() {
    this.loaderState$.next(false);
  }
  public static get default(): Loader {
    if (Loader._default != null) {
      return Loader._default;
    } else {
      Loader._default = new Loader('@default', {
        next: val => {}
      });
    }
    return Loader._default;
  }
  public static set default(value: Loader) {
    Loader._default = value;
  }
}
