import { RecordResult } from './record';
import { BaseResult } from './base';
export declare class DomainResult extends BaseResult {
    records: RecordResult[];
    validate(config: object): RecordResult;
}
