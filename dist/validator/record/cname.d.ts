import { RecordValidator } from './base';
import { Config } from '../../config';
export declare class RecordValidatorCname extends RecordValidator {
    value: string;
    constructor(config: Config, name: string, value: string);
    validate(resolve?: boolean): Promise<number>;
}
