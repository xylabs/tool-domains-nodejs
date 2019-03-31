import { RecordsConfig } from './records';
export declare class ServerConfig extends RecordsConfig {
    static parse(source: any): ServerConfig;
    name: string;
    default?: boolean;
    filters?: string[];
    crawl?: boolean;
    constructor(name: string);
    merge(config?: ServerConfig): this;
}
