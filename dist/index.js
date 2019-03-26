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
const aws_1 = require("./aws");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const chalk_1 = __importDefault(require("chalk"));
const master_1 = require("./validator/master");
const aws_2 = require("./config/aws");
const default_json_1 = __importDefault(require("./config/default.json"));
const load_json_file_1 = __importDefault(require("load-json-file"));
class XyDomainScan {
    constructor() {
        this.aws = new aws_1.AWS();
        this.config = new config_1.MasterConfig("master");
        this.validator = new master_1.MasterValidator(new config_1.MasterConfig("master"));
    }
    loadConfig(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filenameToLoad = filename || './dnslint.json';
                /*const ajv = new Ajv({ schemaId: 'id' })
                const validate = ajv.compile(schema)
                if (!validate(defaultConfig)) {
                  console.error(chalk.red(`${validate.errors}`))
                } else {
                  console.log(chalk.green("Default Config Validated"))
                }*/
                const defaultConfig = config_1.MasterConfig.parse(default_json_1.default);
                console.log(chalk_1.default.gray("Loaded Default Config"));
                try {
                    const userConfigJson = yield load_json_file_1.default(filenameToLoad);
                    const userConfig = config_1.MasterConfig.parse(userConfigJson);
                    /*if (!validate(userJson)) {
                      console.error(chalk.red(`${validate.errors}`))
                    } else {
                      console.log(chalk.green("User Config Validated"))
                    }*/
                    console.log(chalk_1.default.gray("Loaded User Config"));
                    const result = defaultConfig.merge(userConfig);
                    return result;
                }
                catch (ex) {
                    console.log(chalk_1.default.yellow(`No dnslint.json config file found.  Using defaults: ${ex.message}`));
                    console.error(ex.stack);
                    return defaultConfig;
                }
            }
            catch (ex) {
                console.log(chalk_1.default.red(`Failed to load defaults: ${ex}`));
                console.error(ex.stack);
                return new config_1.MasterConfig("master");
            }
        });
    }
    start(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = yield this.loadConfig();
            for (const domain of this.config.domains.values()) {
                domain.serverType = this.config.getServerType(domain.name);
            }
            // if domain specified, clear configed domains and add it
            if (params.singleDomain) {
                console.log(chalk_1.default.yellow(`Configuring Single Domain: ${params.singleDomain}`));
                const singleDomainConfig = this.config.getDomainConfig(params.singleDomain);
                this.config.domains.set(singleDomainConfig.name, singleDomainConfig);
                this.config.aws = new aws_2.AWSConfig("aws");
                this.config.aws.enabled = false;
            }
            this.validator = new master_1.MasterValidator(this.config);
            console.log(`Domains Found: ${this.config.domains.size}`);
            yield this.validator.validate();
            if (params.bucket) {
                this.saveToAws(params.bucket);
            }
            console.log(`Saving to File: ${params.output}`);
            this.saveToFile(params.output);
            if (this.validator.errorCount === 0) {
                console.log(chalk_1.default.green("Congratulations, all tests passed!"));
            }
            else {
                console.error(chalk_1.default.yellow(`Total Errors Found: ${this.validator.errorCount}`));
            }
            return this.validator;
        });
    }
    getLatestS3FileName() {
        return `latest.json`;
    }
    getHistoricS3FileName() {
        const date = new Date().toISOString();
        const parts = date.split('T');
        return `${parts[0]}/${parts[1]}.json`;
    }
    saveToAws(bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.aws.saveFileToS3(bucket, this.getLatestS3FileName(), this.validator);
                yield this.aws.saveFileToS3(bucket, this.getHistoricS3FileName(), this.validator);
            }
            catch (ex) {
                console.error(chalk_1.default.red(ex.message));
                console.error(chalk_1.default.red(ex.stack));
            }
        });
    }
    saveToFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.default.open(filename, 'w', (err, fd) => {
                if (err) {
                    console.log(`failed to open file: ${err}`);
                }
                else {
                    fs_1.default.write(fd, JSON.stringify(this.validator), (errWrite) => {
                        if (errWrite) {
                            console.log(`failed to write file: ${errWrite}`);
                        }
                    });
                }
            });
        });
    }
}
exports.XyDomainScan = XyDomainScan;
//# sourceMappingURL=index.js.map