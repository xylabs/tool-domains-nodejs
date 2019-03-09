import { RecordValidator } from './base';
export declare class RecordValidatorA extends RecordValidator {
    addresses?: any;
    http?: any;
    https?: any;
    reverseDns?: any;
    validate(config: object): Promise<RecordValidatorA>;
}
