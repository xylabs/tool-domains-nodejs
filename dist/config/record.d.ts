export declare class RecordConfig {
    name: string;
    type?: string;
    enabled?: boolean;
    reverseDNS?: {
        "enabled": true;
    };
    allowed?: number[];
    expected?: any[];
    constructor(name: string);
    isEnabled(): boolean;
}
