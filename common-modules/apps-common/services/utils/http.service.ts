import { HttpClient } from '@angular/common/http';
import { Observable, of, EMPTY } from 'rxjs';
import { HttpOptions } from '../../models/utils';
import { KeyValue } from '@angular/common';
import { catchError, map, delay, timeout } from 'rxjs/operators';
import { MessageService } from './message.service';
import { Loader } from './loader.service';
import { ILocalStorageService } from '@root/services/storage/interfaces';

export abstract class HttpService {
  private _httpOptions: HttpOptions;

  constructor(
    protected http: HttpClient,
    protected storage: ILocalStorageService,
    protected localStorageKey: string | null,
    protected messager: MessageService | null,
    protected baseUrl: string
  ) {
    this.httpOptions = HttpService.defaultHttpOptions();
  }

  public static defaultHttpOptions(): HttpOptions {
    return new HttpOptions().setHeader({
      key: 'Content-Type',
      value: 'application/json',
    });
  }

  protected resultMapper: <T>(result: T) => T = (res) => res;

  protected errorDetector: (resultOrError) => any = (res) => res;

  protected abstract get loader(): Loader;

  protected set httpOptions(value: HttpOptions) {
    this._httpOptions = value;
  }

  protected get httpOptions() {
    return this._httpOptions;
  }

  protected abstract errorParser(err: any): Error[];

  protected get<T>(
    path: string,
    ...params: KeyValue<string, string>[]
  ): Observable<T> {
    this.loader.show();

    return this.http
      .get<T>(
        this.baseUrl + path,
        this.httpOptions.addParams(...params).getOptions()
      )
      .pipe(
        map((res) => {
          this.loader.hide();
          return this.resultMapper<T>(this.errorDetector(res));
        }),
        catchError(this.errorHandler<T>())
      );
  }

  protected put<T>(
    path: string,
    body: any = null,
    ...params: KeyValue<string, string>[]
  ): Observable<T> {
    this.loader.show();

    return this.http
      .put<T>(
        this.baseUrl + path,
        body,
        this.httpOptions.addParams(...params).getOptions()
      )
      .pipe(
        map((res) => {
          this.loader.hide();
          return this.resultMapper<T>(this.errorDetector(res));
        }),
        catchError(this.errorHandler<T>())
      );
  }

  protected post<T>(
    path: string,
    body: any = null,
    ...params: KeyValue<string, string>[]
  ): Observable<T> {
    console.log(this.httpOptions);
    this.loader.show();
    return this.http
      .post<T>(
        this.baseUrl + path,
        body,
        this.httpOptions.addParams(...params).getOptions()
      )
      .pipe(
        map((res) => {
          console.log(res);
          this.loader.hide();
          return this.resultMapper<T>(this.errorDetector(res));
        }),
        catchError(this.errorHandler<T>())
      );
  }

  protected patch<T>(
    path: string,
    body: any = null,
    ...params: KeyValue<string, string>[]
  ): Observable<T> {
    this.loader.show();

    return this.http
      .patch<T>(
        this.baseUrl + path,
        body,
        this.httpOptions.addParams(...params).getOptions()
      )
      .pipe(
        map((res) => {
          this.loader.hide();
          return this.resultMapper<T>(this.errorDetector(res));
        }),
        catchError(this.errorHandler<T>())
      );
  }

  protected head<T>(
    path: string,
    ...params: KeyValue<string, string>[]
  ): Observable<T> {
    this.loader.show();

    return this.http
      .head<T>(
        this.baseUrl + path,
        this.httpOptions.addParams(...params).getOptions()
      )
      .pipe(
        map((res) => {
          this.loader.hide();
          return this.resultMapper<T>(this.errorDetector(res));
        }),
        catchError(this.errorHandler<T>())
      );
  }

  protected options<T>(
    path: string,
    ...params: KeyValue<string, string>[]
  ): Observable<T> {
    this.loader.show();

    return this.http
      .options<T>(
        this.baseUrl + path,
        this.httpOptions.addParams(...params).getOptions()
      )
      .pipe(
        map((res) => {
          this.loader.hide();
          return this.resultMapper<T>(this.errorDetector(res));
        }),
        catchError(this.errorHandler<T>())
      );
  }

  protected jsonp(path: string, callBackParam: string): Observable<Object> {
    return this.http.jsonp(this.baseUrl + path, callBackParam);
  }

  protected delete<T>(
    path: string,
    ...params: KeyValue<string, string>[]
  ): Observable<T> {
    this.loader.show();

    return this.http
      .delete<T>(
        this.baseUrl + path,
        this.httpOptions.addParams(...params).getOptions()
      )
      .pipe(
        map((res) => {
          this.loader.hide();
          return this.resultMapper<T>(this.errorDetector(res));
        }),
        catchError(this.errorHandler<T>())
      );
  }

  private errorHandler<T>(): (
    err: any,
    caught: Observable<T>
  ) => Observable<T> {
    return (err: any): Observable<T> => {
      this.loader.hide();
      // TODO: send the error to remote logging infrastructure
      console.error(err); // log to console instead
      if (this.messager) {
        const errors = this.errorParser(err) || [];
        if (!errors || errors.length === 0) {
          if (Array.isArray(err)) {
            errors.push(...err);
          } else {
            errors.push(err);
          }
        }
        errors.forEach((e) => {
          this.messager.push({
            text: e.message,
            timeout: 5000,
            persist: false,
          });
        });
      }

      // TODO: better job of transforming error for user consumption
      // this.log(`${op} failed: ${err.message}`);

      // Let the app keep running by returning an empty result.
      return EMPTY;
    };
  }
}
