import { RecordsConfig } from "./records";
export declare class DomainConfig {
    [key: string]: any;
    records?: RecordsConfig;
    enabled: boolean;
    timeout: number;
    constructor(domainConfig?: DomainConfig);
    isRecordEnabled(record: string): boolean;
    getRecordConfig(recordType: string, property: string): any;
    isReverseDNSEnabled(record: string): boolean;
}
