import { BaseValidator } from '../base';
export declare class RecordValidator extends BaseValidator {
    type: string;
    addresses?: any;
    http?: any;
    https?: any;
    reverseDns?: any;
    constructor(name: string, type: string);
    validate(timeout: number): Promise<number>;
    protected checkHttp(timeout: number): Promise<void>;
    protected checkHttps(timeout: number): Promise<void>;
    protected lookup(): Promise<void>;
    protected reverseLookup(): Promise<void>;
    private getHttpResponse;
}
