import { RecordValidator } from './base';
export declare class RecordValidatorCname extends RecordValidator {
    value: string;
    constructor(config: {
        name: string;
        value: string;
        resolve: boolean;
        timeout: number;
    });
    validate(): Promise<number>;
}
