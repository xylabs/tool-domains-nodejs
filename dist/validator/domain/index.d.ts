import { RecordValidatorA } from '../record/a';
import { RecordValidatorCname } from '../record/cname';
import { RecordValidator } from '../record/base';
import { BaseValidator } from '../base';
import { Config } from '../../config';
import { RecordValidatorMx } from '../record/mx';
import { RecordValidatorTxt } from '../record/txt';
export declare class DomainValidator extends BaseValidator {
    records: RecordValidator[];
    serverType: string;
    constructor(config: {
        name: string;
        serverType: string;
    });
    validate(config: Config): Promise<number>;
    protected getRecordTypeCount(type: string): Promise<number>;
    protected validateDomainRules(): Promise<void>;
    protected validateA(config: {
        resolve: boolean;
        timeout: number;
    }): Promise<RecordValidatorA[]>;
    protected validateCname(config: {
        resolve: boolean;
        timeout: number;
    }): Promise<RecordValidatorCname[]>;
    protected validateMx(): Promise<RecordValidatorMx[]>;
    protected validateTxt(): Promise<RecordValidatorTxt[]>;
    protected verifyRecordCounts(config: Config): Promise<number>;
}
