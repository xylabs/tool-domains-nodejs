import { BaseValidator } from '../base';
import { Config } from '../../config';
import { RecordConfig } from '../../config/record';
export declare class RecordValidator extends BaseValidator {
    type: string;
    records?: any;
    http?: any;
    https?: any;
    reverseDns?: any;
    constructor(config: Config, name: string, type: string);
    getRecordConfig(): RecordConfig;
    protected checkHttp(ip: string, hostname: string, timeout: number): Promise<any>;
    protected checkHttps(ip: string, hostname: string, timeout: number): Promise<any>;
    protected reverseLookup(ip: string, hostname: string, timeout: number): Promise<void>;
    private validateHttpHeaders;
    private validateHeader;
    private validateHttpsHeaders;
    private sanitizeResponse;
    private getHttpResponse;
}
