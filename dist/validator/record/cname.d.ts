import { RecordValidator } from './base';
export declare class RecordValidatorCname extends RecordValidator {
    value: string;
    constructor(name: string, value: string);
    validate(timeout: number): Promise<number>;
}
