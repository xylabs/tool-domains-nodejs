"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class DomainValidatorWebsite extends _1.DomainValidator {
    constructor(config) {
        super({ name: config.name, serverType: "website" });
    }
    async validate(config) {
        const recordConfigA = config.getRecordConfig(this.serverType, this.name, "A");
        const recordConfigCname = config.getRecordConfig(this.serverType, this.name, "CNAME");
        const recordConfigMx = config.getRecordConfig(this.serverType, this.name, "MX");
        const recordConfigTxt = config.getRecordConfig(this.serverType, this.name, "TXT");
        if (recordConfigA.isEnabled()) {
            this.records = this.records.concat(await this.validateA({ resolve: true, timeout: recordConfigA.getTimeout() }));
        }
        if (recordConfigCname.isEnabled()) {
            this.records = this.records.concat(await this.validateCname({ resolve: false, timeout: recordConfigCname.getTimeout() }));
        }
        if (recordConfigMx.isEnabled()) {
            this.records = this.records.concat(await this.validateMx());
        }
        if (recordConfigTxt.isEnabled()) {
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