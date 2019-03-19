"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DomainConfig {
    constructor(name) {
        this.records = undefined;
        this.enabled = true;
        this.timeout = 1000;
        this.name = name;
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