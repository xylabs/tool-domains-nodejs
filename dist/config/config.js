"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const load_json_file_1 = __importDefault(require("load-json-file"));
const chalk_1 = __importDefault(require("chalk"));
class Config {
    constructor() {
        this.aws = undefined;
    }
    static async load(fileName = './dnslint.json') {
        return new Promise((resolve, reject) => {
            try {
                load_json_file_1.default(fileName).then((json) => {
                    const config = new Config();
                    resolve({ ...config, ...(json) });
                });
            }
            catch (ex) {
                console.log(chalk_1.default.yellow("No dnslint.json config file found.  Using defaults."));
                resolve(new Config());
            }
        });
    }
    getRecordTimeout(domainName, recordName) {
        let timeout = 1000;
        if (this.domains !== undefined) {
            const domainConfig = this.domains[domainName];
            if (domainConfig) {
                timeout = domainConfig.getTimeout(recordName);
            }
        }
        return timeout;
    }
    isRecordEnabled(domainName, recordName) {
        if (this.domains !== undefined) {
            const domainConfig = this.domains[domainName];
            if (domainConfig) {
                return domainConfig.isRecordEnabled(recordName);
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
//# sourceMappingURL=config.js.map