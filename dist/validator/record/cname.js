"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const dns_1 = require("../../dns");
class RecordValidatorCname extends base_1.RecordValidator {
    constructor(config, name, value) {
        super(config, name, "CNAME");
        this.value = value;
    }
    async validate(resolve = true) {
        try {
            const domainConfig = this.config.getDomainConfig(this.name);
            const recordConfig = this.getRecordConfig();
            const timeout = domainConfig.getTimeout();
            const ip = await dns_1.DNS.lookup(this.value);
            if (ip && resolve) {
                this.http = await this.checkHttp(ip, this.name, timeout);
                this.https = await this.checkHttps(ip, this.name, timeout);
                if (recordConfig.reverseDNS) {
                    this.reverseDns = await this.reverseLookup(ip, this.name, timeout);
                }
            }
        }
        catch (ex) {
            this.addError("RecordValidatorCname.validate", `[${this.name}]: ${ex}`);
        }
        return super.validate();
    }
}
exports.RecordValidatorCname = RecordValidatorCname;
//# sourceMappingURL=cname.js.map