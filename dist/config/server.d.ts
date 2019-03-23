import { RecordsConfig } from "./records";
import { Base } from "./base";
export declare class ServerConfig extends Base {
    name: string;
    default?: boolean;
    include?: string[];
    exclude?: string[];
    records?: RecordsConfig;
    crawl?: boolean;
    constructor(name: string, init?: any[]);
}
