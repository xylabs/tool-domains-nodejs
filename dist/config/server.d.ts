import { Config } from "./config";
import { Configs } from './configs';
import { RecordConfig } from './record';
export declare class ServerConfig extends Config {
    static parse(source: any): ServerConfig;
    name: string;
    default?: boolean;
    include?: string[];
    exclude?: string[];
    records?: Configs<RecordConfig>;
    crawl?: boolean;
    constructor(name: string);
    getKey(): string;
    merge(config: ServerConfig): ServerConfig;
}
