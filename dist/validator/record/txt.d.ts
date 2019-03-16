import { RecordValidator } from './base';
export declare class RecordValidatorTxt extends RecordValidator {
    value: string[];
    spf: boolean;
    googleVerification?: string;
    facebookVerification?: string;
    constructor(config: {
        name: string;
        value: string[];
    });
    validate(config: {
        timeout: number;
    }): Promise<number>;
}
