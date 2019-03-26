import { Config } from './config';
export declare class Configs<T extends Config> extends Map<string, T> {
    merge(items?: Configs<T>): this;
    getConfig(key: string, newObject: T): T | undefined;
}