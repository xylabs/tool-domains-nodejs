import { AWS } from './aws';
import { DomainsConfig } from './domains';
import { ServersConfig } from './servers';
import { RecordConfig } from './record';
export declare class Config {
    static load(filename?: string): Promise<Config>;
    aws?: AWS;
    domains?: DomainsConfig;
    servers?: ServersConfig;
    constructor(config?: any);
    getRecordConfig(serverType: string, domainName: string, recordType: string): RecordConfig;
}
