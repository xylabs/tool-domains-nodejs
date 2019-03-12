"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const a_1 = require("./record/a");
const base_1 = require("./record/base");
const base_2 = require("./base");
const dns_1 = require("../dns");
class DomainValidator extends base_2.BaseValidator {
    constructor() {
        super(...arguments);
        this.records = [];
    }
    async validate(config) {
        try {
            console.log(`DomainValidator - validate: ${this.name}`);
            const records = await dns_1.DNS.resolveAny(this.name);
            for (const record of records) {
                console.log(`validate: ${record}`);
                const validator = this.createRecord(this.name, record);
                await validator.validate(config);
                this.records.push(validator);
            }
        }
        catch (ex) {
            console.error(ex);
            this.addError(ex);
        }
        return this;
    }
    createRecord(name, record) {
        switch (record.type) {
            case "A":
                return new a_1.RecordValidatorA(name);
            default:
                return new base_1.RecordValidator(name);
        }
    }
}
exports.DomainValidator = DomainValidator;
//# sourceMappingURL=domain.js.map