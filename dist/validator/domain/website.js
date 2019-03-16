"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class DomainValidatorWebsite extends _1.DomainValidator {
    constructor(config) {
        super({ name: config.name, serverType: "website" });
    }
    async validate(config) {
        await this.verifyRecordCounts({
            A: 4,
            CNAME: 0,
            TXT: 2
        });
        if (config.isRecordEnabled(this.name, "A")) {
            this.records = this.records.concat(await this.validateA({ resolve: true, timeout: config.getRecordTimeout(this.name, "A") }));
        }
        if (config.isRecordEnabled(this.name, "CNAME")) {
            this.records = this.records.concat(await this.validateCname({ resolve: true, timeout: config.getRecordTimeout(this.name, "CNAME") }));
        }
        if (config.isRecordEnabled(this.name, "MX")) {
            this.records = this.records.concat(await this.validateMx());
        }
        if (config.isRecordEnabled(this.name, "TXT")) {
            this.records = this.records.concat(await this.validateTxt());
        }
        return super.validate(config);
    }
    validateDomainRules() {
        return super.validateDomainRules();
    }
}
exports.DomainValidatorWebsite = DomainValidatorWebsite;
//# sourceMappingURL=website.js.map