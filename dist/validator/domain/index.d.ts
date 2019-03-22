import { RecordValidator } from '../record';
import { BaseValidator } from '../base';
import { Config } from '../../config';
export declare class DomainValidator extends BaseValidator {
    records: RecordValidator[];
    serverType: string;
    config: Config;
    pages?: any;
    constructor(name: string, config: Config);
    validate(): Promise<number>;
    private getDomainUrls;
}
