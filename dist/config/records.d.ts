import { RecordConfig } from './record';
export declare class RecordsConfig {
    default?: RecordConfig;
    a?: RecordConfig;
    aaaa?: RecordConfig;
    cname?: RecordConfig;
    mx?: RecordConfig;
    [key: string]: any;
    isEnabled(type: string): boolean;
}
