"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class RecordValidatorA extends base_1.RecordValidator {
    constructor(name, value) {
        super(name, "A");
        this.value = value;
    }
    async validate(timeout) {
        try {
            this.http = await this.checkHttp(this.value, this.name, timeout);
            this.https = await this.checkHttps(this.value, this.name, timeout);
            // this.reverseDns = await this.reverseLookup()
        }
        catch (ex) {
            this.addError("validate", ex);
        }
        return super.validate(timeout);
    }
}
exports.RecordValidatorA = RecordValidatorA;
//# sourceMappingURL=a.js.map