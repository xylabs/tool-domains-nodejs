import { RecordValidator } from './record/base';
import { BaseValidator } from './base';
export declare class DomainValidator extends BaseValidator {
    records: RecordValidator[];
    validate(config: object): Promise<RecordValidator>;
    private createRecord;
}
