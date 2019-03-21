"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class RecordValidatorA extends base_1.RecordValidator {
    constructor(config, name, value) {
        super(config, name, "A");
        this.value = value;
    }
    async validate() {
        try {
            const domainConfig = this.config.getDomainConfig(this.name);
            const recordConfig = this.getRecordConfig();
            const timeout = domainConfig.getTimeout();
            this.http = await this.checkHttp(this.value, this.name, timeout);
            this.https = await this.checkHttps(this.value, this.name, timeout);
            if (recordConfig.reverseDNS) {
                this.reverseDns = await this.reverseLookup(this.value, this.name, timeout);
            }
        }
        catch (ex) {
            this.addError("validate", `Unexpected Error[${this.name}]: ${ex}`);
        }
        return super.validate();
    }
}
exports.RecordValidatorA = RecordValidatorA;
//# sourceMappingURL=a.js.map