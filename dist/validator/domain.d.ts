import { RecordValidator } from './record/base';
import { BaseValidator } from './base';
import { Config } from '../config';
export declare class DomainValidator extends BaseValidator {
    records: RecordValidator[];
    validate(config: Config): Promise<number>;
    private createRecord;
}
