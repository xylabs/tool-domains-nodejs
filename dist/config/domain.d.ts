import { RecordConfig } from "./record";
import { Config } from "./config";
import { Configs } from "./configs";
export declare class DomainConfig extends Config {
    static parse(source: any, type: string): DomainConfig;
    name: string;
    serverType: string;
    records: Configs<RecordConfig>;
    timeout: number;
    crawl?: boolean;
    constructor(name: string, type: string);
    merge(config?: DomainConfig): DomainConfig;
    getKey(): string;
    getTimeout(): number;
    isRecordEnabled(type: string): boolean;
    isReverseDNSEnabled(type: string): boolean;
}
