import { Base } from "./base";
export declare class RecordConfig extends Base {
    type: string;
    enabled?: boolean;
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
    constructor(type: string);
    isEnabled(): boolean;
}
