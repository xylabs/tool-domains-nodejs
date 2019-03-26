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
const validator_1 = require("./validator");
const domain_1 = require("./domain");
const aws_1 = require("../aws");
const chalk_1 = __importDefault(require("chalk"));
class MasterValidator extends validator_1.Validator {
    constructor(config) {
        super(config);
        this.domains = [];
    }
    validate() {
        const _super = Object.create(null, {
            validate: { get: () => super.validate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.addDomainsFromConfig();
            if (this.config.aws && this.config.aws.enabled) {
                yield this.addDomainsFromAws();
            }
            let completedDomains = 0;
            for (const domain of Object.values(this.domains)) {
                try {
                    yield domain.validate();
                    completedDomains++;
                    console.log(`Domain:[${completedDomains}/${this.domains.length}]: ${domain.name} [${domain.type}]`);
                    this.errorCount += yield domain.validate();
                }
                catch (ex) {
                    this.addError("MasterValidator.validate", `Unexpected Error: ${ex.message}`);
                    console.error(chalk_1.default.red(ex.message));
                    console.error(chalk_1.default.red(ex.stack));
                    this.errorCount++;
                }
            }
            return _super.validate.call(this);
        });
    }
    addDomainsFromConfig() {
        if (this.config.domains) {
            for (const domain of this.config.domains.values()) {
                if (domain.name !== "default") {
                    console.log(chalk_1.default.yellow(`Adding Domain from Config: ${domain.name}`));
                    const domainConfig = this.config.getDomainConfig(domain.name);
                    console.log(`Adding Config: ${JSON.stringify(domainConfig)}`);
                    this.domains.push(new domain_1.DomainValidator(domainConfig, this.config.getServerType(domainConfig.name)));
                }
            }
        }
    }
    addDomainsFromAws() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(chalk_1.default.gray("Getting AWS Domains"));
            try {
                const aws = new aws_1.AWS();
                const awsDomains = yield aws.getDomains();
                console.log(chalk_1.default.gray(`AWS Domains Found: ${awsDomains.length}`));
                for (const domain of awsDomains) {
                    // remove trailing '.'
                    const cleanDomain = domain.slice(0, domain.length - 1);
                    const domainConfig = this.config.getDomainConfig(cleanDomain);
                    this.domains.push(new domain_1.DomainValidator(domainConfig, this.config.getServerType(cleanDomain)));
                }
            }
            catch (ex) {
                console.error(chalk_1.default.red(`AWS Domains Error: ${ex.message}`));
            }
        });
    }
}
exports.MasterValidator = MasterValidator;
//# sourceMappingURL=master.js.map