import { Config } from "./config";
export declare class RecordConfig extends Config {
    static parse(source: any, domain: string): RecordConfig;
    type: string;
    domain?: string;
    timeout?: number;
    html?: boolean;
    callTimeMax?: number;
    reverseDNS?: {
        "enabled": true;
        "value": string;
    };
    allowed?: number[];
    values?: any[];
    http?: any;
    https?: any;
    constructor(type: string, domain?: string);
    merge(config?: any): RecordConfig;
    getKey(): string;
    isEnabled(): boolean;
}
