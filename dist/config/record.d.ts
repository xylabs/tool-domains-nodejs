export declare class RecordConfig {
    name: string;
    enabled?: boolean;
    timeout?: number;
    reverseDNS?: {
        "enabled": true;
    };
    allowed?: number[];
    constructor(name: string);
    getTimeout(): number;
    isEnabled(): boolean;
}
