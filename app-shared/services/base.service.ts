import { HttpService, Loader, MessageService } from '@apps.common/services';
import { Injectable, Inject } from '@angular/core';
import { ILocalStorageService } from '@apps.common/services/storage/interfaces';
import { HttpClient } from '@angular/common/http';

export abstract class BaseService extends HttpService {
  constructor(
    protected http: HttpClient,
    protected storage: ILocalStorageService,
    protected localStorageKey: string | null,
    protected messager: MessageService | null,
    protected baseUrl: string
  ) {
    super(http, storage, localStorageKey, messager, baseUrl);
    this.resultMapper = <T>(res) => res.data as T;
    this.errorDetector = (res) => {
      if (!res.data && res.status !== 200) {
        throw this.errorParser(res);
      } else {
        return res;
      }
    };
  }

  protected errorParser(response: any): Error[] {
    if (response.status === 0) {
      return [new Error(`Vous n'êtes pas connecté`)];
    }
    if (response.message && !response.error) {
      return [new Error(response.message)];
    } else if (typeof response.error === 'string') {
      return [new Error(response.error)];
    } else if (response.error) {
      const allErrors = [];
      const error = response.error;
      if (error.errors) {
        for (const key in error.errors) {
          if (error.errors.hasOwnProperty(key)) {
            const err = error.errors[key];
            allErrors.push(...err.map((e) => new Error(e)));
          }
        }
        return allErrors;
      } else {
        return [new Error(error.message)];
      }
    }
  }
}
