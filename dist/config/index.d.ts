import { AWS } from './aws';
import { DomainConfig } from './domain';
import { DomainsConfig } from './domains';
import { ServersConfig } from './servers';
import { RecordConfig } from './record';
import { Base } from './base';
export declare class Config extends Base {
    static load(params: {
        config?: Config;
        filename?: string;
    }): Promise<Config>;
    aws: AWS;
    domains: DomainsConfig;
    servers: ServersConfig;
    constructor(config?: any);
    merge(config: any): void;
    getRecordConfig(domain: string, recordType: string): RecordConfig;
    getRecordConfigs(domain: string): Map<string, RecordConfig>;
    getDomainConfig(domain: string): DomainConfig;
    getServerType(domain: string): string;
}
