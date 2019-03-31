import { Config } from "./config";
export declare class ValueConfig extends Config {
    static parse(source: any): ValueConfig;
    name: string;
    disposition?: string;
    filter?: string | object | number;
    constructor(name: string);
    toString(): string | number | undefined;
}
