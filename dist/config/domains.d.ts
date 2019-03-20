import { DomainConfig } from "./domain";
export declare class DomainsConfig extends Array<DomainConfig> {
    private mapCache?;
    concat(domains: DomainConfig[]): DomainsConfig;
    getConfig(domain: string): DomainConfig;
    getMap(): Map<string, DomainConfig>;
}
