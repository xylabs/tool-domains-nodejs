"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_1 = require("./aws");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const ts_optchain_1 = require("ts-optchain");
const website_1 = require("./validator/domain/website");
const domainkey_1 = require("./validator/domain/domainkey");
const api_1 = require("./validator/domain/api");
const chalk_1 = __importDefault(require("chalk"));
class XyDomainScan {
    constructor() {
        this.aws = new aws_1.AWS();
        this.config = new config_1.Config();
    }
    async start() {
        this.config = await config_1.Config.load();
        const domains = new Map();
        const result = {
            domains: [],
            errorCount: 0
        };
        console.log(chalk_1.default.gray("Getting Domains"));
        if (ts_optchain_1.oc(this.config).aws.enabled(true)) {
            await this.addAWSDomains(domains);
        }
        console.log(chalk_1.default.gray("Getting Config Domains"));
        await this.addConfigDomains(domains);
        console.log(`Domains Found: ${domains.size}`);
        let completedDomains = 0;
        for (const domain of domains.values()) {
            try {
                completedDomains++;
                result.domains.push(domain);
                console.log(`Domain:[${completedDomains}/${domains.size}]: ${domain.name} [${domain.serverType}]`);
                result.errorCount += await domain.validate(this.config);
            }
            catch (ex) {
                result.errorCount++;
                console.error(chalk_1.default.red(ex.message));
                console.error(chalk_1.default.red(ex.stack));
            }
        }
        console.log(`Saving to File: output.json`);
        this.saveToFile("output.json", result);
        return result;
    }
    getServerType(domain) {
        let defaultName = "unknown";
        if (this.config.servers) {
            for (const server of this.config.servers) {
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
    createValidator(domain) {
        switch (this.getServerType(domain)) {
            case "website":
                return new website_1.DomainValidatorWebsite({ name: domain });
            case "api":
                return new api_1.DomainValidatorApi({ name: domain });
            case "domainkey":
                return new domainkey_1.DomainValidatorDomainKey({ name: domain });
        }
        return new website_1.DomainValidatorWebsite({ name: domain });
    }
    async addAWSDomains(domains) {
        console.log(chalk_1.default.gray("Getting AWS Domains"));
        try {
            const awsDomains = await this.aws.getDomains();
            console.log(chalk_1.default.gray(`AWS Domains Found: ${awsDomains.length}`));
            for (const domain of awsDomains) {
                domains.set(domain, this.createValidator(domain));
            }
        }
        catch (ex) {
            console.error(chalk_1.default.red(`AWS Domains Error: ${ex.message}`));
        }
        return domains;
    }
    async addConfigDomains(domains) {
        const domainList = this.config.domains;
        if (domainList) {
            for (const domain of domainList) {
                if (domain.name !== "default") {
                    domains.set(domain.name, this.createValidator(domain.name));
                }
            }
        }
        return domains;
    }
    async saveToFile(filename, obj) {
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
    }
}
exports.XyDomainScan = XyDomainScan;
//# sourceMappingURL=index.js.map