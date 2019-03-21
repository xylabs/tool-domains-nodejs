"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const record_1 = require("./record");
const lodash_1 = __importDefault(require("lodash"));
class RecordsConfig extends Array {
    concat(records) {
        for (const record of records) {
            const recordsConfig = lodash_1.default.merge(new record_1.RecordConfig(record.type), record);
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
        let result = new record_1.RecordConfig(type);
        const map = this.getMap();
        result = lodash_1.default.merge(result, map.get("default"), map.get(type));
        return result;
    }
    getMap() {
        const map = new Map();
        for (const record of this) {
            map.set(record.type, record);
        }
        return map;
    }
}
exports.RecordsConfig = RecordsConfig;
//# sourceMappingURL=records.js.map