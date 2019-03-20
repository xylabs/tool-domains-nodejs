import { RecordValidator } from './base';
import { Config } from '../../config';
export declare class RecordValidatorDmarc extends RecordValidator {
    value: string[];
    missing: string[];
    found: string[];
    constructor(config: Config, name: string, value: string[]);
    validate(): Promise<number>;
    private getMissing;
    private getFound;
}
