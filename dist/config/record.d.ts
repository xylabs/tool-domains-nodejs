import { Config } from "./config";
import { WebcallConfig } from "./webcall";
import { Configs } from "./configs";
import { ValueConfig } from "./value";
export declare class RecordConfig extends Config {
    static parse(source: any, domain?: string): RecordConfig;
    type: string;
    domain?: string;
    timeout?: number;
    callTimeMax?: number;
    reverseDNS?: {
        "enabled": true;
        "value": string;
    };
    values?: Configs<ValueConfig>;
    webcalls?: Configs<WebcallConfig>;
    constructor(type: string, domain?: string);
    merge(config?: any): RecordConfig;
}
