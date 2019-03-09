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
const base_1 = require("../base");
const dns_1 = require("../../dns");
const A_1 = require("./A");
class RecordValidator extends base_1.BaseValidator {
    static create(name, record) {
        switch (record.type) {
            case "A":
                return new A_1.RecordValidatorA(name);
            default:
                return new RecordValidator(name);
        }
    }
    validate(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.addresses = yield dns_1.DNS.lookup(this.name);
            this.http = yield this.getHttpResponse();
            this.https = yield this.getHttpResponse(true);
            this.reverseDns = yield dns_1.DNS.reverse(this.addresses);
            return this;
        });
    }
}
exports.RecordValidator = RecordValidator;
//# sourceMappingURL=base.js.map