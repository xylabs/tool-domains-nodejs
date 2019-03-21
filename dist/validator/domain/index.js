"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    validate() {
        const _super = Object.create(null, {
            validate: { get: () => super.validate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const recordConfigs = this.config.getRecordConfigs(this.name);
            try {
                for (const item of recordConfigs) {
                    const recordConfig = item[1];
                    if (recordConfig.type !== "default") {
                        if (recordConfig.isEnabled()) {
                            const record = new record_1.RecordValidator(this.name, recordConfig);
                            this.records.push(record);
                            this.errorCount += yield record.validate();
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
            return _super.validate.call(this);
        });
    }
}
exports.DomainValidator = DomainValidator;
//# sourceMappingURL=index.js.map