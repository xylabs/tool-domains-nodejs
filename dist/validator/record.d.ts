import { Validator } from './validator';
import { RecordConfig } from '../config/record';
import { WebcallValidator } from './webcall';
import { ValueValidator } from './value';
export declare class RecordValidator extends Validator<RecordConfig> {
    type: string;
    domain: string;
    records: any[];
    webcalls: WebcallValidator[];
    values: ValueValidator[];
    reverseDns?: any;
    constructor(config: RecordConfig, domain: string);
    validate(): Promise<number>;
    protected validateWebcalls(): Promise<WebcallValidator[]>;
    protected validateValues(): Promise<ValueValidator[]>;
    protected reverseLookup(value?: string): Promise<any[]>;
    private resolve;
}
