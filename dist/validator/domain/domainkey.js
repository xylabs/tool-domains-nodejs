"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class DomainValidatorDomainKey extends _1.DomainValidator {
    constructor(config) {
        super({ name: config.name, serverType: "domainkey" });
    }
    async validate(config) {
        await this.verifyRecordCounts({
            CNAME: 1,
            TXT: 1
        });
        if (config.isRecordEnabled(this.name, "TXT")) {
            this.records = this.records.concat(await this.validateTxt());
        }
        if (config.isRecordEnabled(this.name, "CNAME")) {
            this.records = this.records.concat(await this.validateCname({ resolve: false, timeout: config.getRecordTimeout(this.name, "CNAME") }));
        }
        return super.validate(config);
    }
    validateDomainRules() {
        return super.validateDomainRules();
    }
}
exports.DomainValidatorDomainKey = DomainValidatorDomainKey;
//# sourceMappingURL=domainkey.js.map