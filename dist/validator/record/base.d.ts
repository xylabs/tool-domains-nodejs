/// <reference types="node" />
import { BaseValidator } from '../base';
import { AnyRecord } from 'dns';
export declare class RecordValidator extends BaseValidator {
    static create(name: string, record: AnyRecord): RecordValidator;
    addresses?: any;
    http?: any;
    https?: any;
    reverseDns?: any;
    validate(config: object): Promise<BaseValidator>;
}
