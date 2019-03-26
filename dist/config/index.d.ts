import { AWSConfig } from './aws';
import { DomainConfig } from './domain';
import { RecordConfig } from './record';
import { Config } from './config';
import { Configs } from './configs';
import { ServerConfig } from './server';
export declare class MasterConfig extends Config {
    static parse(source: any): any;
    aws: AWSConfig;
    domains: Configs<DomainConfig>;
    servers: Configs<ServerConfig>;
    merge(config?: MasterConfig): this;
    getRecordConfig(domain: string, recordType: string): RecordConfig;
    getRecordConfigs(domain: string): Configs<RecordConfig>;
    getDomainConfig(domain: string): DomainConfig;
    getServerConfig(server: string): ServerConfig;
    getServerType(domain: string): string;
    private resolveRecords;
    private getRecordConfigsFromServers;
    private getRecordConfigsFromDomains;
}
