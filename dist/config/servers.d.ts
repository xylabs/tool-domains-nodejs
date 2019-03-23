import { ServerConfig } from "./server";
import { RecordConfig } from "./record";
export declare class ServersConfig extends Array<ServerConfig> {
    concat(servers: ServerConfig[]): ServersConfig;
    getConfig(serverType: string): ServerConfig;
    getRecordConfig(serverType: string, recordType: string): RecordConfig;
    getMap(): Map<string, ServerConfig>;
}
