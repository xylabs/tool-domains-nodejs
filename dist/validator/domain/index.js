"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const a_1 = require("../record/a");
const cname_1 = require("../record/cname");
const base_1 = require("../base");
const dns_1 = require("../../dns");
const chalk_1 = __importDefault(require("chalk"));
const mx_1 = require("../record/mx");
const txt_1 = require("../record/txt");
class DomainValidator extends base_1.BaseValidator {
    constructor(config, name, serverType) {
        super(config, name);
        this.records = [];
        this.name = name;
        this.serverType = serverType;
    }
    async validate() {
        const recordConfigA = this.config.getRecordConfig(this.name, "A");
        const recordConfigMx = this.config.getRecordConfig(this.name, "MX");
        const recordConfigTxt = this.config.getRecordConfig(this.name, "TXT");
        try {
            if (recordConfigA.isEnabled()) {
                const record = await this.validateA();
                this.records = this.records.concat(record);
                for (const item of record) {
                    this.errorCount += await item.validate();
                }
            }
            const recordConfigCname = this.config.getRecordConfig(this.name, "CNAME");
            if (recordConfigCname.isEnabled()) {
                const record = await this.validateCname();
                this.records = this.records.concat(record);
                for (const item of record) {
                    this.errorCount += await item.validate();
                }
            }
            if (recordConfigMx.isEnabled()) {
                const record = await this.validateMx();
                this.records = this.records.concat(record);
                for (const item of record) {
                    this.errorCount += await item.validate();
                }
            }
            if (recordConfigTxt.isEnabled()) {
                const record = await this.validateTxt();
                this.records = this.records.concat(record);
                for (const item of record) {
                    this.errorCount += await item.validate();
                }
            }
            await this.validateDomainRules();
            if (this.errors) {
                this.errorCount += this.errors.length;
            }
            if (this.errorCount === 0) {
                console.log(chalk_1.default.green(`${this.name}: OK`));
            }
            else {
                console.error(chalk_1.default.red(`${this.name}: ${this.errorCount} Errors`));
            }
        }
        catch (ex) {
            this.addError("domain", ex);
        }
        return super.validate();
    }
    async getRecordTypeCount(type) {
        const subTypes = type.split('|');
        let count = 0;
        for (const subType of subTypes) {
            count += (await dns_1.DNS.resolve(this.name, type)).length;
        }
        return count;
    }
    async validateDomainRules() {
        // we do not allow both A and CNAME records
        if (await this.getRecordTypeCount("A") > 0 && await this.getRecordTypeCount("CNAME") > 0) {
            this.addError("domain", `Conflict: Has both A and CNAME records [${this.name}]`);
        }
    }
    async validateA() {
        const validators = [];
        try {
            const records = await dns_1.DNS.resolve4(this.name);
            for (const record of records) {
                const validator = new a_1.RecordValidatorA(this.config, this.name, record);
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
                const validator = new cname_1.RecordValidatorCname(this.config, this.name, record);
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
                const validator = new mx_1.RecordValidatorMx(this.config, this.name, record);
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
                const validator = new txt_1.RecordValidatorTxt(this.config, this.name, record);
                validators.push(validator);
            }
        }
        catch (ex) {
            this.addError("domain:validateTxt", ex);
        }
        return validators;
    }
    async verifyRecordCounts(config) {
        let errorCount = 0;
        if (config.servers) {
            const serverConfig = config.servers.getMap().get(this.serverType);
            if (serverConfig) {
                const records = serverConfig.records;
                if (records) {
                    for (const record of records) {
                        if (record.allowed) {
                            const count = await this.getRecordTypeCount(record.name);
                            let allowed = false;
                            for (const allow of record.allowed) {
                                if (count === allow) {
                                    allowed = true;
                                }
                            }
                            if (!allowed) {
                                this.addError('verifyRecordCounts', `Invalid Record Count: ${record.name} = ${count} [Expected: ${record.allowed}]`);
                                errorCount++;
                            }
                        }
                    }
                }
            }
        }
        return errorCount;
    }
}
exports.DomainValidator = DomainValidator;
//# sourceMappingURL=index.js.map