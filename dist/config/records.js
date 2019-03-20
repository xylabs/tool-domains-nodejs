"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const record_1 = require("./record");
class RecordsConfig extends Array {
    concat(records) {
        for (const record of records) {
            const recordsConfig = Object.assign(new record_1.RecordConfig(record.name), record);
            this.push(recordsConfig);
        }
        return this;
    }
    isEnabled(type) {
        const map = this.getMap();
        let value = true;
        const obj = map.get(type);
        if (obj && obj.enabled !== undefined) {
            value = obj.enabled;
        }
        else {
            const def = map.get("default");
            if (def && def.enabled !== undefined) {
                value = def.enabled;
            }
        }
        return value;
    }
    getConfig(type) {
        const result = new record_1.RecordConfig(type);
        const map = this.getMap();
        Object.assign(result, map.get("default"));
        Object.assign(result, map.get(type));
        return result;
    }
    getMap() {
        const map = new Map();
        for (const record of this) {
            map.set(record.name, record);
        }
        return map;
    }
}
exports.RecordsConfig = RecordsConfig;
//# sourceMappingURL=records.js.map