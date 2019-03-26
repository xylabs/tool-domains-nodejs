import { RecordConfig } from './record';
export declare class RecordsConfig extends Array<RecordConfig> {
    concat(records: RecordConfig[]): RecordsConfig;
    isEnabled(type: string): boolean;
    getConfig(type: string): any;
    getMap(): Map<string, RecordConfig>;
}
