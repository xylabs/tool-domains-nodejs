import { BaseValidator } from './base';
export declare class RecordValidator extends BaseValidator {
    addresses?: any;
    http?: any;
    https?: any;
    reverseDns?: any;
    validate(config: object): Promise<BaseValidator>;
}
