export declare class RecordConfig {
    type: string;
    enabled?: boolean;
    timeout?: number;
    html?: boolean;
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
