"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domain_1 = require("./domain");
class DomainsConfig extends Array {
    concat(domains) {
        for (const domain of domains) {
            const domainConfig = Object.assign(new domain_1.DomainConfig(domain.name), domain);
            this.push(domainConfig);
        }
        return this;
    }
    getConfig(domain) {
        const result = new domain_1.DomainConfig(domain);
        const map = this.getMap();
        Object.assign(result, map.get("default"));
        Object.assign(result, map.get(domain));
        result.name = domain;
        return result;
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