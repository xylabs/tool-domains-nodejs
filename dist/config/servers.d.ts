import { ServerConfig } from "./server";
export declare class ServersConfig extends Array<ServerConfig> {
    concat(servers: ServerConfig[]): ServersConfig;
    getConfig(serverType: string): ServerConfig;
    getMap(): Map<string, ServerConfig>;
}
