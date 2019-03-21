import { RecordValidator } from './base';
import { Config } from '../../config';
export declare class RecordValidatorTxt extends RecordValidator {
    value: string[];
    spf: boolean;
    googleVerification?: string;
    facebookVerification?: string;
    constructor(config: Config, name: string, value: string[]);
    validate(): Promise<number>;
}
