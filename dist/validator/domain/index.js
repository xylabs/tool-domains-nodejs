"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const record_1 = require("../record");
const base_1 = require("../base");
const chalk_1 = __importDefault(require("chalk"));
class DomainValidator extends base_1.BaseValidator {
    constructor(name, config) {
        super(name);
        this.records = [];
        this.name = name;
        this.config = config;
        this.serverType = config.getServerType(name);
    }
    async validate() {
        const recordConfigs = this.config.getRecordConfigs(this.name);
        try {
            for (const item of recordConfigs) {
                const recordConfig = item[1];
                if (recordConfig.type !== "default") {
                    if (recordConfig.isEnabled()) {
                        const record = new record_1.RecordValidator(this.name, recordConfig);
                        this.records.push(record);
                        this.errorCount += await record.validate();
                    }
                }
            }
        }
        catch (ex) {
            this.addError("DomainValidator.validate", ex.message);
            console.error(chalk_1.default.red(ex.stack)); // since this is unexpected, show the stack
        }
        if (this.errorCount) {
            console.log(chalk_1.default.yellow(`Errors: ${this.errorCount}`));
        }
        return super.validate();
    }
}
exports.DomainValidator = DomainValidator;
//# sourceMappingURL=index.js.map