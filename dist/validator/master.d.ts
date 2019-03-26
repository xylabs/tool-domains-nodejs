import { MasterConfig } from '../config';
import { Validator } from './validator';
import { DomainValidator } from './domain';
export declare class MasterValidator extends Validator<MasterConfig> {
    domains: DomainValidator[];
    constructor(config: MasterConfig);
    validate(): Promise<number>;
    private addDomainsFromConfig;
    private addDomainsFromAws;
}
