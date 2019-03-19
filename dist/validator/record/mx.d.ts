/// <reference types="node" />
import { RecordValidator } from './base';
import { MxRecord } from 'dns';
export declare class RecordValidatorMx extends RecordValidator {
    value: MxRecord;
    constructor(config: {
        name: string;
        value: MxRecord;
    });
    validate(config: {
        timeout: number;
    }): Promise<number>;
}
