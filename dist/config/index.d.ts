import { AWS } from './aws';
import { DomainConfig } from './domain';
import { DomainsConfig } from './domains';
import { ServersConfig } from './servers';
import { RecordConfig } from './record';
export declare class Config {
    static load(params: {
        config?: Config;
        filename?: string;
    }): Promise<Config>;
    aws?: AWS;
    domains?: DomainsConfig;
    servers?: ServersConfig;
    constructor(config?: any);
    getDomains(): DomainsConfig;
    getServers(): ServersConfig;
    getRecordConfig(domain: string, recordType: string): RecordConfig;
    getRecordConfigs(domain: string): Map<string, RecordConfig>;
    getDomainConfig(domain: string): DomainConfig;
    getServerType(domain: string): string;
}
