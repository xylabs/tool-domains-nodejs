"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_1 = require("./aws");
const domain_1 = require("./domain");
const lodash_1 = __importDefault(require("lodash"));
const record_1 = require("./record");
const config_1 = require("./config");
const configs_1 = require("./configs");
const server_1 = require("./server");
class MasterConfig extends config_1.Config {
    constructor() {
        super(...arguments);
        this.aws = new aws_1.AWSConfig();
        this.domains = new configs_1.Configs();
        this.servers = new configs_1.Configs();
    }
    static parse(source) {
        let srcObj = source;
        if (typeof source === "string") {
            srcObj = JSON.parse(source);
        }
        const master = lodash_1.default.merge(new MasterConfig(), srcObj);
        master.domains = new configs_1.Configs();
        if (srcObj.domains) {
            for (const domain of srcObj.domains) {
                const serverType = master.getServerType(domain.name);
                const newDomainObj = domain_1.DomainConfig.parse(domain, serverType);
                master.domains.set(newDomainObj.name, newDomainObj);
            }
        }
        master.servers = new configs_1.Configs();
        if (srcObj.servers) {
            for (const server of srcObj.servers) {
                const newServerObj = server_1.ServerConfig.parse(server);
                master.servers.set(newServerObj.name, newServerObj);
            }
        }
        return master;
    }
    merge(config) {
        if (config) {
            this.aws = this.aws.merge(config.aws);
            this.domains = this.domains.merge(config.domains);
            this.servers = this.servers.merge(config.servers);
        }
        return this;
    }
    getRecordConfig(domain, recordType) {
        const serverType = this.getServerType(domain);
        let serverRecord = new record_1.RecordConfig(recordType, domain);
        let domainRecord = new record_1.RecordConfig(recordType, domain);
        if (this.servers !== undefined) {
            const serverConfig = this.servers.getConfig(serverType);
            if (serverConfig && serverConfig.records) {
                const record = serverConfig.records.getConfig(recordType);
                if (record) {
                    serverRecord = record;
                }
            }
        }
        if (this.domains !== undefined) {
            const domainConfig = this.domains.getConfig(domain);
            if (domainConfig && domainConfig.records) {
                const record = domainConfig.records.getConfig(recordType);
                if (record) {
                    domainRecord = record;
                }
            }
        }
        return serverRecord.merge(domainRecord);
    }
    getRecordConfigs(domain) {
        const result = new configs_1.Configs();
        const serverType = this.getServerType(domain);
        if (this.servers !== undefined) {
            const serverConfig = this.servers.getConfig(serverType);
            if (serverConfig) {
                const records = serverConfig.records;
                if (records) {
                    for (const record of records.values()) {
                        if (record.type) {
                            const existing = result.get(record.type);
                            if (existing === undefined) {
                                result.set(record.type, this.getRecordConfig(domain, record.type));
                            }
                            else {
                                result.set(record.type, existing.merge(this.getRecordConfig(domain, record.type)));
                            }
                        }
                    }
                }
            }
        }
        if (this.domains !== undefined) {
            const domainConfig = this.domains.getConfig(domain);
            if (domainConfig) {
                const records = domainConfig.records;
                if (records) {
                    for (const record of records.values()) {
                        if (record.type) {
                            const existing = result.get(record.type);
                            if (existing === undefined) {
                                result.set(record.type, this.getRecordConfig(domain, record.type));
                            }
                            else {
                                result.set(record.type, existing.merge(this.getRecordConfig(domain, record.type)));
                            }
                        }
                    }
                }
            }
        }
        return result;
    }
    getDomainConfig(domain) {
        let result = new domain_1.DomainConfig(domain, this.getServerType(domain));
        if (this.domains !== undefined) {
            result = result.merge(this.domains.getConfig(domain));
            result.records = this.getRecordConfigs(domain);
        }
        result.name = domain;
        return result;
    }
    getServerConfig(server) {
        let result = new server_1.ServerConfig(server);
        if (this.servers !== undefined) {
            result = lodash_1.default.merge(result, this.servers.getConfig(server));
        }
        return result;
    }
    getServerType(domain) {
        let defaultName = "unknown";
        if (this.servers) {
            for (const server of this.servers.values()) {
                const include = server.include;
                if (include) {
                    for (const filter of include) {
                        if (domain.match(filter)) {
                            return server.name;
                        }
                        if (server.default) {
                            defaultName = server.name;
                        }
                    }
                }
            }
        }
        return defaultName;
    }
}
exports.MasterConfig = MasterConfig;
//# sourceMappingURL=index.js.map