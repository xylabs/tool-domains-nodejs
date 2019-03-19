"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class RecordValidatorA extends base_1.RecordValidator {
    constructor(config) {
        super({ name: config.name, type: "A" });
        this.value = config.value;
    }
    async validate(config) {
        try {
            this.http = await this.checkHttp(this.value, this.name, config.timeout);
            this.https = await this.checkHttps(this.value, this.name, config.timeout);
            this.reverseDns = await this.reverseLookup(this.value, this.name, config.timeout);
        }
        catch (ex) {
            this.addError("validate", `Unexpected Error[${this.name}]: ${ex}`);
        }
        return super.validate(config);
    }
}
exports.RecordValidatorA = RecordValidatorA;
//# sourceMappingURL=a.js.map