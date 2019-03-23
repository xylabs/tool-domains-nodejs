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
const validator_1 = require("./validator");
class XyDomainScan {
    constructor() {
        this.aws = new aws_1.AWS();
        this.config = new config_1.Config();
    }
    start(output, singleDomain, config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = yield config_1.Config.load({ config });
            const domains = new Map();
            const result = {
                domains: [],
                errorCount: 0
            };
            // special case if domain specified
            if (singleDomain) {
                domains.set(singleDomain, new validator_1.DomainValidator(singleDomain, this.config));
            }
            else {
                console.log(chalk_1.default.gray("Getting Domains"));
                if (this.config.aws) {
                    if (this.config.aws.enabled) {
                        yield this.addAWSDomains(domains);
                    }
                }
                console.log(chalk_1.default.gray("Getting Config Domains"));
                if (this.config.domains) {
                    yield this.addDomains(domains, this.config.domains);
                }
            }
            console.log(`Domains Found: ${domains.size}`);
            let completedDomains = 0;
            for (const domain of domains.values()) {
                try {
                    completedDomains++;
                    result.domains.push(domain);
                    console.log(`Domain:[${completedDomains}/${domains.size}]: ${domain.name} [${domain.serverType}]`);
                    result.errorCount += yield domain.validate();
                }
                catch (ex) {
                    result.errorCount++;
                    console.error(chalk_1.default.red(ex.message));
                    console.error(chalk_1.default.red(ex.stack));
                }
            }
            console.log(`Saving to File: ${output}`);
            this.saveToFile(output, result);
            if (result.errorCount === 0) {
                console.log(chalk_1.default.green("Congratulations, all tests passed!"));
            }
            else {
                console.error(chalk_1.default.yellow(`Total Errors Found: ${result.errorCount}`));
            }
            return result;
        });
    }
    addAWSDomains(domains) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(chalk_1.default.gray("Getting AWS Domains"));
            try {
                const awsDomains = yield this.aws.getDomains();
                console.log(chalk_1.default.gray(`AWS Domains Found: ${awsDomains.length}`));
                for (const domain of awsDomains) {
                    domains.set(domain, new validator_1.DomainValidator(domain, this.config));
                }
            }
            catch (ex) {
                console.error(chalk_1.default.red(`AWS Domains Error: ${ex.message}`));
            }
            return domains;
        });
    }
    addDomains(domains, domainsConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (domainsConfig) {
                for (const domain of domainsConfig) {
                    if ((domain.name !== "default") && (domain.enabled === undefined || domain.enabled)) {
                        domains.set(domain.name, new validator_1.DomainValidator(domain.name, this.config));
                    }
                }
            }
            return domains;
        });
    }
    saveToFile(filename, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.default.open(filename, 'w', (err, fd) => {
                if (err) {
                    console.log(`failed to open file: ${err}`);
                }
                else {
                    fs_1.default.write(fd, JSON.stringify(obj), (errWrite) => {
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