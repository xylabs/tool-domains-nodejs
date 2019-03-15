"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DomainConfig {
    constructor(domainConfig) {
        this.records = undefined;
        this.enabled = true;
        this.timeout = 1000;
        if (domainConfig) {
            Object.assign(this, domainConfig);
        }
    }
    isRecordEnabled(record) {
        if (!this.enabled) {
            return false;
        }
        if (this.records) {
            const recordConfig = this.records[record];
            if (recordConfig) {
                if (recordConfig.enabled === undefined) {
                    if (this.records !== undefined && this.records.default !== undefined) {
                        if (this.records.default.enabled === undefined) {
                            return true;
                        }
                        return this.records.default.enabled;
                    }
                }
                else {
                    return recordConfig.enabled;
                }
            }
        }
        return true;
    }
    getRecordConfig(recordType, property) {
        if (this.records) {
            const recordConfig = this.records[recordType] || this.records.default;
            if (recordConfig) {
                if (recordConfig[property] !== undefined) {
                    return recordConfig[property];
                }
            }
        }
        return this[property];
    }
    isReverseDNSEnabled(record) {
        if (this.records) {
            const recordConfig = this.records[record];
            if (recordConfig) {
                if (recordConfig.reverseDNS === undefined && recordConfig.reverseDNS.enabled === undefined) {
                    if (this.records !== undefined && this.records.default !== undefined) {
                        if (this.records.default !== undefined &&
                            this.records.default.reverseDNS !== undefined &&
                            this.records.default.reverseDNS.enabled !== undefined) {
                            return this.records.default.reverseDNS.enabled;
                        }
                    }
                }
                else if (recordConfig.reverseDNS.enabled !== undefined) {
                    return recordConfig.reverseDNS.enabled;
                }
            }
        }
        return false;
    }
}
exports.DomainConfig = DomainConfig;
//# sourceMappingURL=domain.js.map