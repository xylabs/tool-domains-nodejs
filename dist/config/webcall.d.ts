import { Config } from "./config";
export declare class WebcallConfig extends Config {
    static parse(source: any, host: string): WebcallConfig;
    protocol: string;
    port?: number;
    host?: string;
    timeout?: number;
    html?: boolean;
    callTimeMax?: number;
    headers?: any[];
    statusCode?: number;
    constructor(protocol: string, host?: string);
}
