import { Validator } from "./validator";
import { WebcallConfig } from "../config/webcall";
import { ValueValidator } from "./value";
export declare class WebcallValidator extends Validator<WebcallConfig> {
    protocol: string;
    address: string;
    host: string;
    headers?: any[];
    statusCode?: number;
    statusMessage?: string;
    callTime?: number;
    constructor(config: WebcallConfig, address: string, host: string);
    validate(): Promise<number>;
    protected validateHeaders(): Promise<ValueValidator[]>;
    private validateHtml;
    private get;
}
