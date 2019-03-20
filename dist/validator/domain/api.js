"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class DomainValidatorApi extends _1.DomainValidator {
    constructor(config, name) {
        super(config, name, "api");
    }
    async validate() {
        const recordConfigA = this.config.getRecordConfig(this.name, "A");
        const recordConfigCname = this.config.getRecordConfig(this.name, "CNAME");
        const recordConfigMx = this.config.getRecordConfig(this.name, "MX");
        const recordConfigTxt = this.config.getRecordConfig(this.name, "TXT");
        if (recordConfigA.isEnabled()) {
            this.records = this.records.concat(await this.validateA());
        }
        if (recordConfigCname.isEnabled()) {
            this.records = this.records.concat(await this.validateCname());
        }
        if (recordConfigMx.isEnabled()) {
            this.records = this.records.concat(await this.validateMx());
        }
        if (recordConfigTxt.isEnabled()) {
            this.records = this.records.concat(await this.validateTxt());
        }
        return super.validate();
    }
    validateDomainRules() {
        return super.validateDomainRules();
    }
}
exports.DomainValidatorApi = DomainValidatorApi;
//# sourceMappingURL=api.js.map