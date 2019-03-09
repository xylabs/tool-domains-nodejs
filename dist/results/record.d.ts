import { BaseResult } from './base';
export declare class RecordResult extends BaseResult {
    addresses?: any;
    http?: any;
    https?: any;
    reverseDns?: any;
    validate(config: object): RecordResult;
}
