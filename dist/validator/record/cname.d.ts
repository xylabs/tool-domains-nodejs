import { RecordValidator } from './base';
export declare class RecordValidatorCNAME extends RecordValidator {
    constructor(name: string);
    validate(timeout: number): Promise<number>;
}
