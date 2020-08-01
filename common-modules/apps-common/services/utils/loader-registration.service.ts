import { Injectable } from '@angular/core';
import { PartialObserver } from 'rxjs';
import { Loader } from './loader.service';
@Injectable()
export class LoaderRegistrationService {
  static readonly loaders: {
    [key: string]: Loader;
  } = {};
  constructor() {}
  register(name: string, observer: PartialObserver<boolean>) {
    const loader = LoaderRegistrationService.loaders[name];
    if (loader == null) {
      LoaderRegistrationService.loaders[name] = new Loader(name, observer);
    } else {
      loader.addSubscription(observer);
    }
  }
  unregister(name): void {
    const loader = LoaderRegistrationService.loaders[name];
    if (loader) {
      loader.unSubscribe();
      delete LoaderRegistrationService.loaders[name];
    }
  }
  get(name: string): Loader {
    const loader = LoaderRegistrationService.loaders[name];
    if (loader != null) {
      return loader;
    }
    return Loader.default;
  }
}
