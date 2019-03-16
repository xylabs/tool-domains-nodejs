"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const load_json_file_1 = __importDefault(require("load-json-file"));
const domain_1 = require("./domain");
const chalk_1 = __importDefault(require("chalk"));
const default_json_1 = __importDefault(require("./default.json"));
const merge_1 = __importDefault(require("merge"));
class Config {
    constructor(config) {
        this.aws = undefined;
        if (config) {
            Object.assign(this, config);
        }
    }
    static async load(filename = './dnslint.json') {
        try {
            const defaultJson = await load_json_file_1.default(`${__dirname}/default.json`);
            try {
                const userJson = await load_json_file_1.default(filename);
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
    getRecordTimeout(domainName, recordType) {
        let timeout = 1000;
        if (this.domains !== undefined) {
            const domainConfig = this.domains[domainName] || this.domains.default;
            if (domainConfig) {
                const config = new domain_1.DomainConfig(domainConfig);
                timeout = config.getRecordConfigProperty(recordType, "timeout");
            }
        }
        return timeout;
    }
    isRecordEnabled(domainName, recordName) {
        if (this.domains !== undefined) {
            const domainConfig = this.domains[domainName];
            if (domainConfig) {
                const config = new domain_1.DomainConfig(domainConfig);
                return config.isRecordEnabled(recordName);
            }
        }
        return true;
    }
    isReverseDNSEnabled(domainName, recordName) {
        if (this.domains !== undefined) {
            const domainConfig = this.domains[domainName];
            if (domainConfig) {
                return domainConfig.isReverseDNSEnabled(recordName);
            }
        }
        return true;
    }
}
exports.Config = Config;
//# sourceMappingURL=index.js.map