"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const dns_1 = require("../../dns");
class RecordValidatorA extends base_1.RecordValidator {
    async validate(config) {
        console.log("RecordValidatorA-validate");
        this.addresses = await dns_1.DNS.lookup(this.name);
        this.http = await this.getHttpResponse();
        this.https = await this.getHttpResponse(true);
        this.reverseDns = await dns_1.DNS.reverse(this.addresses);
        return this;
    }
}
exports.RecordValidatorA = RecordValidatorA;
//# sourceMappingURL=a.js.map