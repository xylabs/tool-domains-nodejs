"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class RecordValidatorSpf extends base_1.RecordValidator {
    constructor(name, value, expected) {
        super(name, "TXT(SPF)");
        this.found = [];
        this.value = value;
        this.missing = expected;
    }
    async validate(timeout) {
        try {
            for (let i = 1; i < this.value.length; i++) {
                const missing = this.getMissing(this.value[i]);
                const found = this.getFound(this.value[i]);
                if (missing === -1) { // not missing
                    if (found !== -1) { // found
                        this.addError("validateSpf", `Duplicate SPF: ${this.value[i]}`);
                    }
                    else { // not found
                        this.addError("validateSpf", `Unexpected SPF: ${this.value[i]}`);
                    }
                }
                else { // missing
                    if (found !== -1) { // found
                        this.addError("validateSpf", `Invalid SPF Expectations [Double]: ${this.value[i]}`);
                    }
                    else { // not found
                        this.found.push(this.value[i]); // add to found
                        this.missing.splice(missing, 1); // remove from missing
                    }
                }
            }
        }
        catch (ex) {
            this.addError("validate", ex);
        }
        return super.validate(timeout);
    }
    getMissing(value) {
        for (let i = 0; i < this.missing.length; i++) {
            if (value === this.missing[i]) {
                return i;
            }
        }
        return -1;
    }
    getFound(value) {
        for (let i = 0; i < this.found.length; i++) {
            if (value === this.found[i]) {
                return i;
            }
        }
        return -1;
    }
}
exports.RecordValidatorSpf = RecordValidatorSpf;
//# sourceMappingURL=spf.js.map