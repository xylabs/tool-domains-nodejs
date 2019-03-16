"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const a_1 = require("./record/a");
const cname_1 = require("./record/cname");
const base_1 = require("./base");
const dns_1 = require("../dns");
const chalk_1 = __importDefault(require("chalk"));
const mx_1 = require("./record/mx");
const txt_1 = require("./record/txt");
class DomainValidator extends base_1.BaseValidator {
    constructor() {
        super(...arguments);
        this.records = [];
    }
    async validate(config) {
        let errorCount = 0;
        try {
            if (config.isRecordEnabled(this.name, "A")) {
                this.records = this.records.concat(await this.validateA());
            }
            if (config.isRecordEnabled(this.name, "CNAME")) {
                this.records = this.records.concat(await this.validateCname());
            }
            if (config.isRecordEnabled(this.name, "MX")) {
                this.records = this.records.concat(await this.validateMx());
            }
            if (config.isRecordEnabled(this.name, "TXT")) {
                this.records = this.records.concat(await this.validateTxt());
            }
            for (const record of this.records) {
                await record.validate(config.getRecordTimeout(this.name, record.type));
                if (record.errors) {
                    errorCount += record.errors.length;
                }
            }
            if (this.errors) {
                errorCount += this.errors.length;
            }
            if (errorCount === 0) {
                console.log(chalk_1.default.green(`${this.name}: OK`));
            }
            else {
                console.error(chalk_1.default.red(`${this.name}: ${errorCount} Errors`));
            }
        }
        catch (ex) {
            this.addError("domain", ex);
        }
        if (this.errors) {
            return this.errors.length + errorCount;
        }
        return errorCount;
    }
    async validateA() {
        const validators = [];
        try {
            const records = await dns_1.DNS.resolve4(this.name);
            for (const record of records) {
                const validator = new a_1.RecordValidatorA(this.name, record);
                validators.push(validator);
            }
        }
        catch (ex) {
            this.addError("domain:validateA", ex);
        }
        return validators;
    }
    async validateCname() {
        const validators = [];
        try {
            const records = await dns_1.DNS.resolveCname(this.name);
            for (const record of records) {
                const validator = new cname_1.RecordValidatorCname(this.name, record);
                validators.push(validator);
            }
        }
        catch (ex) {
            this.addError("domain:validateCname", ex);
        }
        return validators;
    }
    async validateMx() {
        const validators = [];
        try {
            const records = await dns_1.DNS.resolveMx(this.name);
            for (const record of records) {
                const validator = new mx_1.RecordValidatorMx(this.name, record);
                validators.push(validator);
            }
        }
        catch (ex) {
            this.addError("domain:validateMx", ex);
        }
        return validators;
    }
    async validateTxt() {
        const validators = [];
        try {
            const records = await dns_1.DNS.resolveTxt(this.name);
            for (const record of records) {
                const validator = new txt_1.RecordValidatorTxt(this.name, record);
                validators.push(validator);
            }
        }
        catch (ex) {
            this.addError("domain:validateTxt", ex);
        }
        return validators;
    }
}
exports.DomainValidator = DomainValidator;
//# sourceMappingURL=domain.js.map