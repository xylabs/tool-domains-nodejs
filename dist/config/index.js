"use strict";
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
const ajv_1 = __importDefault(require("ajv"));
const dnslint_schema_json_1 = __importDefault(require("../schema/dnslint.schema.json"));
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
    static async load(filename = './dnslint.json') {
        try {
            const ajv = new ajv_1.default({ schemaId: 'id' });
            const validate = ajv.compile(dnslint_schema_json_1.default);
            if (!validate(default_json_1.default)) {
                console.error(chalk_1.default.red(`${validate.errors}`));
            }
            else {
                console.log(chalk_1.default.green("Default Config Validated"));
            }
            try {
                const userJson = await load_json_file_1.default(filename);
                if (!validate(userJson)) {
                    console.error(chalk_1.default.red(`${validate.errors}`));
                }
                else {
                    console.log(chalk_1.default.green("User Config Validated"));
                }
                console.log(chalk_1.default.gray("Loaded User Config"));
                const result = new Config(lodash_1.default.mergeWith(default_json_1.default, userJson, (objValue, srcValue, key, object, source, stack) => {
                    return undefined;
                }));
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