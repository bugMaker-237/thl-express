import { Injectable } from '@angular/core';
import { IStorageOptions } from '../../models/utils/storage-options';
import { ILocalStorageService } from './interfaces/i.storage.service';

@Injectable()
export class LocalStorageService implements ILocalStorageService {

    getObject<T>(key: string): T {
        const val = localStorage.getItem(key);

        if (val == null) { return null; }

        if (val === 'null') { return null; }

        if (val === 'undefined') { return undefined; }

        return JSON.parse(val);
    }

    getString(key: string): string {
        return localStorage.getItem(key);
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    set<T>(key: string, data: T): void {
        let str: unknown;
        if (typeof data !== 'string') {
            str = JSON.stringify(data);
        } else {
            str = data;
        }
        localStorage.setItem(key, str as string);
    }

    appendToLocal<T>(key: string, data: T, options: IStorageOptions): void {

        let val = this.getObject<T>(key) as unknown;

        if (val == null) {
            if (!options.createIfNotExist) { return; } else {
                if (options.type === 'object') { val = {}; } else if (options.type === 'array') { val = []; } else {
                    throw new Error('Option.type not supproted : ' + options.type);
                }
            }
        }

        if (Array.isArray(val)) {
            val.push(data);
        } else {
            if (typeof options.objPropName === 'undefined') {
                throw new Error('options.objPropName cannot be undefined when setting type object');
            }

            Object.defineProperty(val, options.objPropName, {
                value: data,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
        this.set<T>(key, val as T);
    }
}
