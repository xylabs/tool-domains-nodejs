import { AWS } from './aws';
import { DomainsConfig } from './domains';
export declare class Config {
    static load(fileName?: string): Promise<Config>;
    aws?: AWS;
    domains?: DomainsConfig;
    getRecordTimeout(domainName: string, recordName: string): number;
    isRecordEnabled(domainName: string, recordName: string): boolean;
    isReverseDNSEnabled(domainName: string, recordName: string): boolean;
}
