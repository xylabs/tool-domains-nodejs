import { RecordConfig } from './record';
export declare class RecordsConfig extends Array<RecordConfig> {
    isEnabled(type: string): boolean;
    getConfig(type: string): RecordConfig;
    getMap(): Map<string, RecordConfig>;
}
