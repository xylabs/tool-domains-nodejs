"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const spf_1 = require("./spf");
class RecordValidatorTxt extends base_1.RecordValidator {
    constructor(name, value) {
        super(name, "TXT");
        this.spf = false;
        this.value = value;
    }
    async validate(timeout) {
        try {
            const spaceSplit = this.value[0].split(" ");
            if (spaceSplit.length > 1) {
                switch (spaceSplit[0]) {
                    case "v=spf1": {
                        const validateSpf = new spf_1.RecordValidatorSpf(this.name, this.value, [
                            "include:mail.zendesk.com",
                            "include:_spf.google.com"
                        ]);
                        await validateSpf.validate(timeout);
                        this.addErrors(validateSpf.errors);
                        break;
                    }
                    default: {
                        this.addError("validate", `Unexpected space TXT record: ${this.value}`);
                        break;
                    }
                }
            }
            else {
                const equalSplit = this.value[0].split('=');
                if (equalSplit.length > 1) {
                    switch (equalSplit[0]) {
                        case "google-site-verification": {
                            this.googleVerification = equalSplit[1];
                            break;
                        }
                        case "facebook-domain-verification": {
                            this.facebookVerification = equalSplit[1];
                            break;
                        }
                        default: {
                            this.addError("validate", `Unexpected equals TXT record: ${this.value}`);
                            break;
                        }
                    }
                }
                else {
                    this.addError("validate", `Unexpected TXT record: ${this.value}`);
                }
            }
        }
        catch (ex) {
            this.addError("validate", ex);
        }
        return super.validate(timeout);
    }
}
exports.RecordValidatorTxt = RecordValidatorTxt;
//# sourceMappingURL=txt.js.map