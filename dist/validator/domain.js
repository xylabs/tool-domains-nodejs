"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const a_1 = require("./record/a");
const cname_1 = require("./record/cname");
const base_1 = require("./record/base");
const base_2 = require("./base");
const dns_1 = require("../dns");
const chalk_1 = __importDefault(require("chalk"));
class DomainValidator extends base_2.BaseValidator {
    constructor() {
        super(...arguments);
        this.records = [];
    }
    async validate(config) {
        let errorCount = 0;
        try {
            const records = await dns_1.DNS.resolveAny(this.name);
            for (const record of records) {
                if (config.isRecordEnabled(this.name, record.type)) {
                    const validator = this.createRecord(this.name, record);
                    await validator.validate(config.getRecordTimeout(this.name, record.type));
                    this.records.push(validator);
                    if (validator.errors) {
                        errorCount += validator.errors.length;
                    }
                }
                else {
                    console.log(chalk_1.default.gray(`Record Disabled: ${record.type}`));
                }
            }
            if (errorCount === 0) {
                console.log(chalk_1.default.green(`${this.name}: OK`));
            }
            else {
                console.error(chalk_1.default.red(`${this.name}: ${errorCount} Errors`));
            }
        }
        catch (ex) {
            console.error(chalk_1.default.red(ex.message));
            this.addError("domain", ex);
        }
        return errorCount;
    }
    createRecord(name, record) {
        switch (record.type) {
            case "A":
                return new a_1.RecordValidatorA(name);
            case "CNAME":
                return new cname_1.RecordValidatorCNAME(name);
            default:
                return new base_1.RecordValidator(name, record.type);
        }
    }
}
exports.DomainValidator = DomainValidator;
//# sourceMappingURL=domain.js.map