import { AWS } from './aws';
import { DomainsConfig } from './domains';
export declare class Config {
    static load(filename?: string): Promise<Config>;
    aws?: AWS;
    domains?: DomainsConfig;
    constructor(config?: any);
    getRecordTimeout(domainName: string, recordType: string): number;
    isRecordEnabled(domainName: string, recordName: string): boolean;
    isReverseDNSEnabled(domainName: string, recordName: string): boolean;
}
