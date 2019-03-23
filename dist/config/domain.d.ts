import { RecordsConfig } from "./records";
export declare class DomainConfig {
    name: string;
    records?: RecordsConfig;
    enabled?: boolean;
    timeout?: number;
    serverType?: string;
    crawl?: boolean;
    constructor(name: string, init?: any[]);
    getTimeout(): number;
    isRecordEnabled(type: string): boolean;
    isReverseDNSEnabled(type: string): boolean;
}
