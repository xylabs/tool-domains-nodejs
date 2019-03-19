import { Config } from '../../config';
import { DomainValidator } from '.';
export declare class DomainValidatorDomainKey extends DomainValidator {
    constructor(config: {
        name: string;
    });
    validate(config: Config): Promise<number>;
    protected validateDomainRules(): Promise<void>;
}
