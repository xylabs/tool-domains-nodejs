import { RecordsConfig } from "./records";
export declare class DomainConfig {
    name: string;
    records?: RecordsConfig;
    enabled?: boolean;
    timeout?: number;
    constructor(name: string);
    getTimeout(): number;
    isRecordEnabled(type: string): boolean;
    isReverseDNSEnabled(type: string): boolean;
}
