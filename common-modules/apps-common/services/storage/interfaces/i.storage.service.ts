import { IStorageOptions } from '@root/models';

export interface ILocalStorageService {
    getObject<T>(key: string): T;
    getString(key: string): string;
    remove(key: string): void;
    set<T>(key: string, data: T): void;
    appendToLocal<T>(key: string, data: T, options: IStorageOptions): void;
}
