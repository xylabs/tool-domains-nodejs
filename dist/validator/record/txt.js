"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const spf_1 = require("./spf");
const dmarc_1 = require("./dmarc");
class RecordValidatorTxt extends base_1.RecordValidator {
    constructor(config, name, value) {
        super(config, name, "TXT");
        this.spf = false;
        this.value = value;
    }
    async validate() {
        try {
            const spaceSplit = this.value[0].split(" ");
            if (spaceSplit.length > 1) {
                switch (spaceSplit[0]) {
                    case "v=DMARC1;": {
                        const validateDmarc = new dmarc_1.RecordValidatorDmarc(this.config, this.name, this.value);
                        await validateDmarc.validate();
                        this.addErrors(validateDmarc.errors);
                        break;
                    }
                    case "k=rsa;": {
                        const validateDmarc = new dmarc_1.RecordValidatorDmarc(this.config, this.name, this.value);
                        await validateDmarc.validate();
                        this.addErrors(validateDmarc.errors);
                        break;
                    }
                    case "v=spf1": {
                        const validateSpf = new spf_1.RecordValidatorSpf(this.config, this.name, this.value);
                        await validateSpf.validate();
                        this.addErrors(validateSpf.errors);
                        break;
                    }
                    default: {
                        this.addError("validate", `Unexpected space TXT record [${this.name}]: ${this.value}`);
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
                            this.addError("validate", `Unexpected equals TXT record [${this.name}]: ${this.value}`);
                            break;
                        }
                    }
                }
                else {
                    this.addError("validate", `Unexpected TXT record [${this.name}]: ${this.value}`);
                }
            }
        }
        catch (ex) {
            this.addError("RecordValidatorTxt.validate", `Unexpected Error[${this.name}]: ${ex}`);
        }
        return super.validate();
    }
}
exports.RecordValidatorTxt = RecordValidatorTxt;
//# sourceMappingURL=txt.js.map