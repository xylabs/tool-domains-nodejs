import { Config } from "./config";
import { Configs } from "./configs";
import { RecordConfig } from "./record";
export declare class RecordsConfig extends Config {
    records: Configs<RecordConfig>;
    merge(config?: RecordsConfig): this;
}
