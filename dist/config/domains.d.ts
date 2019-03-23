import { DomainConfig } from "./domain";
import { RecordConfig } from "./record";
export declare class DomainsConfig extends Array<DomainConfig> {
    private mapCache?;
    merge(items: any[]): DomainsConfig;
    concat(domains: DomainConfig[]): DomainsConfig;
    getConfig(domain: string): DomainConfig;
    getRecordConfig(serverType: string, recordType: string): RecordConfig;
    getMap(): Map<string, DomainConfig>;
}
