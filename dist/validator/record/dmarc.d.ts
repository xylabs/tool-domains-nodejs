import { RecordValidator } from './base';
export declare class RecordValidatorDmarc extends RecordValidator {
    value: string[];
    missing: string[];
    found: string[];
    constructor(name: string, value: string[], expected: string[]);
    validate(timeout: number): Promise<number>;
    private getMissing;
    private getFound;
}
