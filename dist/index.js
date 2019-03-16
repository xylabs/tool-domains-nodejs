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
        if (ts_optchain_1.oc(this.config).aws.enabled(true)) {
            await this.addAWSDomains(domains);
        }
        await this.addConfigDomains(domains);
        console.log(`Domains Found: ${domains.size}`);
        let completedDomains = 0;
        for (const domain of domains.values()) {
            completedDomains++;
            result.domains.push(domain);
            console.log(`Domain:[${completedDomains}/${domains.size}]: ${domain.name} [${domain.serverType}]`);
            result.errorCount += await domain.validate(this.config);
        }
        console.log(`Saving to File: output.json`);
        this.saveToFile("output.json", result);
        return result;
    }
    getServerType(domain) {
        if (this.config.servers) {
            for (const key of Object.keys(this.config.servers)) {
                const server = this.config.servers[key];
                const include = server.include;
                if (include) {
                    for (const filter of include) {
                        if (domain.match(filter)) {
                            return key;
                        }
                    }
                }
            }
        }
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
        const awsDomains = await this.aws.getDomains();
        for (const domain of awsDomains) {
            domains.set(domain, this.createValidator(domain));
        }
        return domains;
    }
    async addConfigDomains(domains) {
        if (this.config && this.config.domains) {
            const keys = Object.keys(this.config.domains);
            for (const key of keys) {
                if (key !== "default") {
                    const domain = this.config.domains[key];
                    domains.set(key, this.createValidator(key));
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