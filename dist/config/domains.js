"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const domain_1 = require("./domain");
const record_1 = require("./record");
const lodash_1 = __importDefault(require("lodash"));
class DomainsConfig extends Array {
    merge(items) {
        const map = this.getMap();
        this.mapCache = undefined;
        for (const item of items) {
            const newItem = map.get(item.name) || new domain_1.DomainConfig(item.name);
            map.set(item.name, newItem.merge(item));
        }
        const result = new DomainsConfig();
        for (const item of map) {
            result.push(item[1]);
        }
        return result;
    }
    concat(domains) {
        for (const domain of domains) {
            const domainConfig = Object.assign(new domain_1.DomainConfig(domain.name), domain);
            this.push(domainConfig);
        }
        return this;
    }
    getConfig(domain) {
        const map = this.getMap();
        let result = new domain_1.DomainConfig(domain);
        result = result.merge(map.get("default"));
        result = result.merge(map.get(domain));
        return result;
    }
    getRecordConfig(domain, recordType) {
        let defaultRecordConfig = new record_1.RecordConfig(domain, recordType);
        let domainRecordConfig = new record_1.RecordConfig(domain, recordType);
        const defaultConfig = this.getConfig("default");
        const domainConfig = this.getConfig(domain);
        if (defaultConfig && defaultConfig.records) {
            defaultRecordConfig = defaultConfig.records.getConfig(recordType);
        }
        if (domainConfig && domainConfig.records) {
            domainRecordConfig = domainConfig.records.getConfig(recordType);
        }
        return lodash_1.default.merge(defaultRecordConfig, domainRecordConfig);
    }
    getMap() {
        if (this.mapCache) {
            return this.mapCache;
        }
        this.mapCache = new Map();
        for (const domain of this) {
            this.mapCache.set(domain.name, domain);
        }
        return this.mapCache;
    }
}
exports.DomainsConfig = DomainsConfig;
//# sourceMappingURL=domains.js.map