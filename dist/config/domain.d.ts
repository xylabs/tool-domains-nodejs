import { RecordsConfig } from "./records";
export declare class DomainConfig extends RecordsConfig {
    static parse(source: any, type?: string): DomainConfig;
    name: string;
    serverType: string;
    timeout: number;
    crawl?: boolean;
    constructor(name: string, type: string);
    merge(config?: DomainConfig): this;
    getTimeout(): number;
    isRecordEnabled(type: string): boolean;
    isReverseDNSEnabled(type: string): boolean;
}
