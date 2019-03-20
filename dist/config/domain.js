"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const records_1 = require("./records");
const lodash_1 = __importDefault(require("lodash"));
class DomainConfig {
    constructor(name, init) {
        this.name = name;
        if (init) {
            for (const obj of init) {
                lodash_1.default.merge(this, obj);
            }
        }
        this.records = new records_1.RecordsConfig().concat(this.records || []);
    }
    getTimeout() {
        return this.timeout || 1000;
    }
    isRecordEnabled(type) {
        if (!this.enabled) {
            return false;
        }
        if (this.records) {
            const recordConfig = this.records.getConfig(type);
            if (recordConfig) {
                if (recordConfig.enabled !== undefined) {
                    return recordConfig.enabled;
                }
            }
        }
        return true;
    }
    isReverseDNSEnabled(type) {
        if (this.records) {
            const recordConfig = this.records.getConfig(type);
            if (recordConfig) {
                if (recordConfig.reverseDNS !== undefined && recordConfig.reverseDNS.enabled !== undefined) {
                    return recordConfig.reverseDNS.enabled;
                }
            }
        }
        return false;
    }
}
exports.DomainConfig = DomainConfig;
//# sourceMappingURL=domain.js.map