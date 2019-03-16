"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const dns_1 = require("../../dns");
class RecordValidatorCname extends base_1.RecordValidator {
    constructor(name, value) {
        super(name, "CNAME");
        this.value = value;
    }
    async validate(timeout) {
        try {
            const ip = await dns_1.DNS.lookup(this.value);
            if (ip) {
                this.http = await this.checkHttp(ip, this.name, timeout);
                this.https = await this.checkHttps(ip, this.name, timeout);
                this.reverseDns = await this.reverseLookup(ip, this.name, timeout);
            }
        }
        catch (ex) {
            this.addError("RecordValidatorCname.validate", `[${this.name}]: ${ex}`);
        }
        return super.validate(timeout);
    }
}
exports.RecordValidatorCname = RecordValidatorCname;
//# sourceMappingURL=cname.js.map