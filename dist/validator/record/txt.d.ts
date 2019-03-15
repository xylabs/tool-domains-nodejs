import { RecordValidator } from './base';
export declare class RecordValidatorTxt extends RecordValidator {
    value: string[];
    spf: boolean;
    googleVerification?: string;
    facebookVerification?: string;
    constructor(name: string, value: string[]);
    validate(timeout: number): Promise<number>;
}
