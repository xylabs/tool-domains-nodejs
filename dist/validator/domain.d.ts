import { RecordValidator } from './record';
import { Validator } from './validator';
import { DomainConfig } from '../config/domain';
export declare class DomainValidator extends Validator<DomainConfig> {
    name: string;
    type: string;
    records: RecordValidator[];
    pages?: any;
    constructor(config: DomainConfig, type: string);
    validate(): Promise<number>;
    private getDomainUrls;
}
