import { RecordsConfig } from "./records";
import { Base } from "./base";
export declare class DomainConfig extends Base {
    name: string;
    records: RecordsConfig;
    enabled: boolean;
    timeout: number;
    serverType: string;
    crawl?: boolean;
    constructor(name: string);
    getTimeout(): number;
    isRecordEnabled(type: string): boolean;
    isReverseDNSEnabled(type: string): boolean;
}
