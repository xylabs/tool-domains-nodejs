import { Config } from "./config";
import { WebcallConfig } from "./webcall";
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
    http?: WebcallConfig;
    https?: WebcallConfig;
    constructor(type: string, domain?: string);
    merge(config?: any): RecordConfig;
}
