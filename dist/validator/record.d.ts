import { Validator } from './validator';
import { RecordConfig } from '../config/record';
import { WebcallValidator } from './webcall';
export declare class RecordValidator extends Validator<RecordConfig> {
    type: string;
    domain: string;
    records: any[];
    webcalls: WebcallValidator[];
    reverseDns?: any;
    constructor(config: RecordConfig, domain: string);
    validate(): Promise<number>;
    protected validateWebcalls(): Promise<WebcallValidator[]>;
    protected reverseLookup(value?: string): Promise<any[]>;
    private resolve;
}
