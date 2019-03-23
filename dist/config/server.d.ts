import { RecordsConfig } from "./records";
export declare class ServerConfig {
    name: string;
    default?: boolean;
    include?: string[];
    exclude?: string[];
    records?: RecordsConfig;
    crawl?: boolean;
    constructor(name: string, init?: any[]);
}
