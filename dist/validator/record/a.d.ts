import { RecordValidator } from './base';
export declare class RecordValidatorA extends RecordValidator {
    value: string;
    constructor(config: {
        name: string;
        value: string;
    });
    validate(config: {
        timeout: number;
    }): Promise<number>;
}
