"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const records_1 = require("./records");
const base_1 = require("./base");
class DomainConfig extends base_1.Base {
    constructor(name) {
        super();
        this.records = new records_1.RecordsConfig();
        this.enabled = true;
        this.timeout = 1000;
        this.serverType = "unknown";
        this.name = name;
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