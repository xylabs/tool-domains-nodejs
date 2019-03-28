"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const record_1 = require("./record");
const lodash_1 = __importDefault(require("lodash"));
const configs_1 = require("./configs");
const assert_1 = __importDefault(require("assert"));
const records_1 = require("./records");
class DomainConfig extends records_1.RecordsConfig {
    constructor(name, type) {
        super(name);
        this.timeout = 1000;
        this.name = name;
        this.serverType = type;
    }
    static parse(source, type) {
        let srcObj = source;
        if (typeof source === "string") {
            srcObj = JSON.parse(source);
        }
        assert_1.default(typeof srcObj.name === "string");
        assert_1.default(type);
        let domain = new DomainConfig(srcObj.name, type || "unknown");
        domain = lodash_1.default.merge(domain, srcObj);
        domain.records = new configs_1.Configs();
        if (srcObj.records) {
            for (const record of srcObj.records) {
                const newRecordObj = record_1.RecordConfig.parse(record, domain.name);
                domain.records.set(newRecordObj.type, newRecordObj);
            }
        }
        return domain;
    }
    merge(config) {
        if (config) {
            const name = this.name;
            lodash_1.default.merge(new DomainConfig(name, this.serverType), config);
            this.name = name;
            super.merge(config);
        }
        return this;
    }
    getTimeout() {
        return this.timeout || 1000;
    }
    isRecordEnabled(type) {
        if (!this.enabled) {
            return false;
        }
        if (this.records) {
            const recordConfig = this.records.getConfig(type, new record_1.RecordConfig(type, this.name));
            if (recordConfig) {
                return recordConfig.isEnabled();
            }
        }
        return true;
    }
    isReverseDNSEnabled(type) {
        if (this.records) {
            const recordConfig = this.records.getConfig(type, new record_1.RecordConfig(type, this.name));
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