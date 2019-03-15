import { BaseValidator } from '../base';
export declare class RecordValidator extends BaseValidator {
    type: string;
    records?: any;
    http?: any;
    https?: any;
    reverseDns?: any;
    constructor(name: string, type: string);
    validate(timeout: number): Promise<number>;
    protected checkHttp(ip: string, hostname: string, timeout: number): Promise<any>;
    protected checkHttps(ip: string, hostname: string, timeout: number): Promise<any>;
    protected reverseLookup(): Promise<string[] | undefined>;
    private validateHttpHeaders;
    private validateHttpsHeaders;
    private sanitizeResponse;
    private getHttpResponse;
}
