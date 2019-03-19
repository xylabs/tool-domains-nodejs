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
const lodash_1 = __importDefault(require("lodash"));
class DomainValidator extends base_1.BaseValidator {
    constructor(config) {
        super({ name: config.name });
        this.records = [];
        this.serverType = config.serverType;
    }
    async validate(config) {
        let errorCount = 0;
        const recordConfigA = config.getRecordConfig(this.serverType, this.name, "A");
        const recordConfigCname = config.getRecordConfig(this.serverType, this.name, "CNAME");
        const recordConfigMx = config.getRecordConfig(this.serverType, this.name, "MX");
        const recordConfigTxt = config.getRecordConfig(this.serverType, this.name, "TXT");
        try {
            if (recordConfigA.isEnabled()) {
                this.records = this.records.concat(await this.validateA({ resolve: true, timeout: recordConfigA.getTimeout() }));
            }
            if (recordConfigCname.isEnabled()) {
                this.records = this.records.concat(await this.validateCname({ resolve: false, timeout: recordConfigCname.getTimeout() }));
            }
            if (recordConfigMx.isEnabled()) {
                this.records = this.records.concat(await this.validateMx());
            }
            if (recordConfigTxt.isEnabled()) {
                this.records = this.records.concat(await this.validateTxt());
            }
            for (const record of this.records) {
                errorCount += await record.validate(config);
            }
            await this.validateDomainRules();
            if (this.errors) {
                errorCount += this.errors.length;
            }
            if (errorCount === 0) {
                console.log(chalk_1.default.green(`${this.name}: OK`));
            }
            else {
                this.addError("validate", `Errors Detected[${this.name}]: ${errorCount}`);
                console.error(chalk_1.default.red(`${this.name}: ${errorCount} Errors`));
            }
        }
        catch (ex) {
            this.addError("domain", ex);
        }
        if (this.errors) {
            return this.errors.length + errorCount;
        }
        return super.validate(config);
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
    async validateA(config) {
        const validators = [];
        try {
            const records = await dns_1.DNS.resolve4(this.name);
            for (const record of records) {
                const validator = new a_1.RecordValidatorA(lodash_1.default.merge({ name: this.name, value: record }, this.config));
                validators.push(validator);
            }
        }
        catch (ex) {
            this.addError("domain:validateA", ex);
        }
        return validators;
    }
    async validateCname(config) {
        const validators = [];
        try {
            const records = await dns_1.DNS.resolveCname(this.name);
            for (const record of records) {
                const validator = new cname_1.RecordValidatorCname(lodash_1.default.merge({ name: this.name, value: record }, this.config));
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
                const validator = new mx_1.RecordValidatorMx({ name: this.name, value: record });
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
                const validator = new txt_1.RecordValidatorTxt({ name: this.name, value: record });
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