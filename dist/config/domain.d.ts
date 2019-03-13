import { RecordsConfig } from "./records";
export declare class DomainConfig {
    records?: RecordsConfig;
    enabled: boolean;
    timeout: number;
    isRecordEnabled(record: string): boolean;
    getTimeout(record: string): number;
    isReverseDNSEnabled(record: string): boolean;
}
