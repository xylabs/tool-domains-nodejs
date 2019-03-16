import { RecordsConfig } from "./records";
interface IDomainConfig {
    [key: string]: any;
    enabled: boolean;
    timeout: number;
}
export declare class DomainConfig implements IDomainConfig {
    records?: RecordsConfig;
    enabled: boolean;
    timeout: number;
    constructor(domainConfig?: DomainConfig);
    isRecordEnabled(record: string): boolean;
    getRecordConfigProperty(recordType: string, property: string): any;
    isReverseDNSEnabled(record: string): boolean;
}
export {};
