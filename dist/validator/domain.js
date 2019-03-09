"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const record_1 = require("./record");
const base_1 = require("./base");
const dns_1 = require("../dns");
class DomainValidator extends base_1.BaseValidator {
    constructor() {
        super(...arguments);
        this.records = [];
    }
    validate(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const records = yield dns_1.DNS.resolveAny(this.name);
                for (const record of records) {
                    const validator = record_1.RecordValidator.create(this.name, record);
                    yield validator.validate(config);
                    this.records.push(validator);
                }
            }
            catch (ex) {
                this.addError(ex);
            }
            return this;
        });
    }
}
exports.DomainValidator = DomainValidator;
//# sourceMappingURL=domain.js.map