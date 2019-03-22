"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const load_json_file_1 = __importDefault(require("load-json-file"));
const domain_1 = require("./domain");
const chalk_1 = __importDefault(require("chalk"));
const domains_1 = require("./domains");
const default_json_1 = __importDefault(require("./default.json"));
const lodash_1 = __importDefault(require("lodash"));
const servers_1 = require("./servers");
const record_1 = require("./record");
class Config {
    constructor(config) {
        this.aws = undefined;
        if (config) {
            Object.assign(this, config);
        }
        this.domains = new domains_1.DomainsConfig().concat(this.domains || []);
        this.servers = new servers_1.ServersConfig().concat(this.servers || []);
    }
    static load(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                params.filename = params.filename || './dnslint.json';
                /*const ajv = new Ajv({ schemaId: 'id' })
                const validate = ajv.compile(schema)
                if (!validate(defaultConfig)) {
                  console.error(chalk.red(`${validate.errors}`))
                } else {
                  console.log(chalk.green("Default Config Validated"))
                }*/
                console.log(chalk_1.default.gray("Loaded Default Config"));
                try {
                    const userJson = yield load_json_file_1.default(params.filename);
                    /*if (!validate(userJson)) {
                      console.error(chalk.red(`${validate.errors}`))
                    } else {
                      console.log(chalk.green("User Config Validated"))
                    }*/
                    console.log(chalk_1.default.gray("Loaded User Config"));
                    let result;
                    if (params.config) {
                        result = new Config(lodash_1.default.mergeWith(params.config, default_json_1.default, userJson, (objValue, srcValue, key, object, source, stack) => {
                            return undefined;
                        }));
                    }
                    else {
                        result = new Config(lodash_1.default.mergeWith(default_json_1.default, userJson, (objValue, srcValue, key, object, source, stack) => {
                            return undefined;
                        }));
                    }
                    return result;
                }
                catch (ex) {
                    console.log(chalk_1.default.yellow("No dnslint.json config file found.  Using defaults."));
                    return new Config(default_json_1.default);
                }
            }
            catch (ex) {
                console.log(chalk_1.default.red(`Failed to load defaults: ${ex}`));
                return new Config();
            }
        });
    }
    getDomains() {
        if (!this.domains) {
            this.domains = new domains_1.DomainsConfig();
        }
        return this.domains;
    }
    getServers() {
        if (!this.servers) {
            this.servers = new servers_1.ServersConfig();
        }
        return this.servers;
    }
    getRecordConfig(domain, recordType) {
        const serverType = this.getServerType(domain);
        const result = new record_1.RecordConfig(recordType);
        if (this.servers !== undefined) {
            const records = this.servers.getConfig(serverType).records;
            if (records) {
                Object.assign(result, records.getConfig(recordType));
            }
        }
        if (this.domains !== undefined) {
            const records = this.domains.getConfig(domain).records;
            if (records) {
                Object.assign(result, records.getConfig(recordType));
            }
        }
        return result;
    }
    getRecordConfigs(domain) {
        const serverType = this.getServerType(domain);
        const result = new Map();
        if (this.domains !== undefined) {
            const records = this.domains.getConfig("default").records;
            if (records) {
                for (const record of records) {
                    if (record.type) {
                        result.set(record.type, records.getConfig(record.type));
                    }
                }
            }
        }
        if (this.servers !== undefined) {
            const records = this.servers.getConfig(serverType).records;
            if (records) {
                for (const record of records) {
                    if (record.type) {
                        const newItem = lodash_1.default.merge(result.get(record.type) || new record_1.RecordConfig(record.type), records.getConfig(record.type));
                        result.set(record.type, newItem);
                    }
                }
            }
        }
        if (this.domains !== undefined) {
            const records = this.domains.getConfig(domain).records;
            if (records) {
                for (const record of records) {
                    if (record.type) {
                        const newItem = lodash_1.default.merge(result.get(record.type) || new record_1.RecordConfig(record.type), records.getConfig(record.type));
                        result.set(record.type, newItem);
                    }
                }
            }
        }
        return result;
    }
    getDomainConfig(domain) {
        const result = new domain_1.DomainConfig(domain);
        if (this.domains !== undefined) {
            Object.assign(result, this.domains.getConfig(domain));
        }
        return result;
    }
    getServerType(domain) {
        let defaultName = "unknown";
        if (this.servers) {
            for (const server of this.servers) {
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
exports.Config = Config;
//# sourceMappingURL=index.js.map