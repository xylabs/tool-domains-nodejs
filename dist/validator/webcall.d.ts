import { Validator } from "./validator";
import { WebcallConfig } from "../config/webcall";
export declare class WebcallValidator extends Validator<WebcallConfig> {
    address: string;
    headers?: any[];
    statusCode?: number;
    statusMessage?: string;
    callTime?: number;
    constructor(config: WebcallConfig, address: string);
    validate(): Promise<number>;
    private validateHeaders;
    private validateHtml;
    private get;
}