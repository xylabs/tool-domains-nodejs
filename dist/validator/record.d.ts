import { Validator } from './validator';
import { RecordConfig } from '../config/record';
export declare class RecordValidator extends Validator<RecordConfig> {
    type: string;
    domain?: string;
    records: any[];
    http?: any[];
    https?: any[];
    reverseDns?: any;
    values?: any;
    constructor(config: RecordConfig);
    validate(): Promise<number>;
    protected checkAllHttp(config?: any): Promise<any[]>;
    protected checkAllHttps(config?: any): Promise<any[]>;
    protected validateHtml(data: string, ip: string): Promise<any>;
    protected get(prefix: string, ip: string): Promise<any>;
    protected checkHttp(value: any): Promise<any>;
    protected checkHttps(value: any): Promise<any>;
    protected reverseLookup(value?: string): Promise<any[]>;
    private resolve;
    private validateHeaders;
}
