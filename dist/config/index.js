"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const load_json_file_1 = __importDefault(require("load-json-file"));
const chalk_1 = __importDefault(require("chalk"));
const domains_1 = require("./domains");
const default_json_1 = __importDefault(require("./default.json"));
const merge_1 = __importDefault(require("merge"));
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
            const defaultJson = await load_json_file_1.default(`${__dirname}/default.json`);
            const ajv = new ajv_1.default({ schemaId: 'id' });
            const validate = ajv.compile(dnslint_schema_json_1.default);
            if (!validate(defaultJson)) {
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
                return new Config(merge_1.default.recursive(true, default_json_1.default, userJson));
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
    getRecordConfig(serverType, domainName, recordType) {
        const result = new record_1.RecordConfig(recordType);
        if (this.servers !== undefined) {
            Object.assign(result, this.servers.getConfig(serverType));
        }
        if (this.domains !== undefined) {
            Object.assign(result, this.domains.getConfig(domainName));
        }
        return result;
    }
}
exports.Config = Config;
//# sourceMappingURL=index.js.map