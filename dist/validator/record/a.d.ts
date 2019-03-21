import { RecordValidator } from './base';
import { Config } from '../../config';
export declare class RecordValidatorA extends RecordValidator {
    value: string;
    constructor(config: Config, name: string, value: string);
    validate(): Promise<number>;
}
