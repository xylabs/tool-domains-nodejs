import { Config } from '../../config';
import { DomainValidator } from '.';
export declare class DomainValidatorWebsite extends DomainValidator {
    constructor(config: Config, name: string);
    validate(): Promise<number>;
    protected validateDomainRules(): Promise<void>;
}
