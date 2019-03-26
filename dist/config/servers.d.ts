import { ServerConfig } from "./server";
export declare class ServersConfig extends Array<ServerConfig> {
    private mapCache?;
    concat(servers: ServerConfig[]): ServersConfig;
    merge(items: any[]): ServersConfig;
    getConfig(serverType: string): ServerConfig;
    getRecordConfig(serverType: string, recordType: string): any;
    getMap(): Map<string, ServerConfig>;
}
