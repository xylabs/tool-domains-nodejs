"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DomainConfig {
    constructor() {
        this.records = undefined;
        this.enabled = true;
        this.timeout = 1000;
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
    getTimeout(record) {
        if (this.records) {
            const recordConfig = this.records[record];
            if (recordConfig) {
                if (recordConfig.timeout === undefined) {
                    if (this.records !== undefined && this.records.default !== undefined) {
                        if (this.records.default.timeout !== undefined) {
                            return this.records.default.timeout;
                        }
                    }
                }
                else {
                    return recordConfig.timeout;
                }
            }
        }
        return this.timeout;
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