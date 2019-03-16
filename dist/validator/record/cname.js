"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const dns_1 = require("../../dns");
class RecordValidatorCname extends base_1.RecordValidator {
    constructor(config) {
        super({ name: config.name, type: "CNAME" });
        this.value = config.value;
        config.timeout = config.timeout || 1000;
    }
    async validate() {
        try {
            const ip = await dns_1.DNS.lookup(this.value);
            if (ip && this.config.resolve) {
                this.http = await this.checkHttp(ip, this.name, this.config.timeout);
                this.https = await this.checkHttps(ip, this.name, this.config.timeout);
                this.reverseDns = await this.reverseLookup(ip, this.name, this.config.timeout);
            }
        }
        catch (ex) {
            this.addError("RecordValidatorCname.validate", `[${this.name}]: ${ex}`);
        }
        return super.validate(this.config);
    }
}
exports.RecordValidatorCname = RecordValidatorCname;
//# sourceMappingURL=cname.js.map