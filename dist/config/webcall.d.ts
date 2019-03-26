import { Config } from "./config";
export declare class WebcallConfig extends Config {
    ssl?: boolean;
    port?: number;
    timeout?: number;
    html?: boolean;
    callTimeMax?: number;
}
