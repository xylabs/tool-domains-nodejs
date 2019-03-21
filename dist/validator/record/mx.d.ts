/// <reference types="node" />
import { RecordValidator } from './base';
import { Config } from '../../config';
import { MxRecord } from 'dns';
export declare class RecordValidatorMx extends RecordValidator {
    value: MxRecord;
    constructor(config: Config, name: string, value: MxRecord);
    validate(): Promise<number>;
}
