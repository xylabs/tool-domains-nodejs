"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class RecordValidatorCNAME extends base_1.RecordValidator {
    constructor(name) {
        super(name, "CNAME");
    }
    async validate(timeout) {
        try {
            this.addresses = await this.lookup();
            this.http = await this.checkHttp(timeout);
            this.https = await this.checkHttps(timeout);
            // this.reverseDns = await this.reverseLookup()
        }
        catch (ex) {
            this.addError("validate", ex);
        }
        return super.validate(timeout);
    }
}
exports.RecordValidatorCNAME = RecordValidatorCNAME;
//# sourceMappingURL=cname.js.map