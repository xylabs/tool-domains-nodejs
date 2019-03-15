/// <reference types="node" />
import { RecordValidator } from './base';
import { MxRecord } from 'dns';
export declare class RecordValidatorMx extends RecordValidator {
    value: MxRecord;
    constructor(name: string, value: MxRecord);
    validate(timeout: number): Promise<number>;
}
