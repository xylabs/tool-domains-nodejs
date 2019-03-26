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
const validator_1 = require("./validator");
const dns_1 = require("../dns");
const chalk_1 = __importDefault(require("chalk"));
const webcall_1 = require("./webcall");
class RecordValidator extends validator_1.Validator {
    constructor(config, domain) {
        super(config);
        this.records = [];
        this.webcalls = [];
        this.domain = domain;
        this.type = config.type;
    }
    validate() {
        const _super = Object.create(null, {
            validate: { get: () => super.validate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.type.split('|').length === 1) {
                yield this.resolve();
                this.webcalls = yield this.validateWebcalls();
                if (this.config.reverseDNS) {
                    if (((this.config.reverseDNS.enabled === undefined) && true) || this.config.reverseDNS.enabled) {
                        this.reverseDns = yield this.reverseLookup(this.config.reverseDNS.value);
                    }
                }
            }
            return _super.validate.call(this);
        });
    }
    validateWebcalls() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            if (this.config.webcalls) {
                for (const webcall of this.config.webcalls.values()) {
                    for (const record of this.records) {
                        const validator = new webcall_1.WebcallValidator(webcall, record, this.domain);
                        result.push(validator);
                        yield validator.validate();
                        this.errorCount += validator.errorCount;
                    }
                }
            }
            return result;
        });
    }
    reverseLookup(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                for (const record of this.records) {
                    let domains;
                    let valid = true;
                    try {
                        domains = yield dns_1.Dns.reverse(record);
                    }
                    catch (ex) {
                        this.addError("reverse", ex.message);
                        valid = false;
                    }
                    if (value && domains) {
                        for (const domain of domains) {
                            if (!domain.match(value)) {
                                valid = false;
                                this.addError("reverse", `Unexpected Domain: ${domain} [Expected: ${value}]`);
                            }
                        }
                    }
                    result.push({
                        ip: record,
                        domains,
                        valid
                    });
                }
            }
            catch (ex) {
                this.addError("RecordValidator.reverseLookup", ex.message);
                console.error(chalk_1.default.red(ex.stack));
            }
            return result;
        });
    }
    resolve() {
        return __awaiter(this, void 0, void 0, function* () {
            this.records = [];
            try {
                if (!this.type) {
                    this.addError("resolve", "Missing Type");
                    return;
                }
                if (!this.domain) {
                    this.addError("resolve", "Missing Domain");
                    return;
                }
                this.records = yield dns_1.Dns.resolve(this.domain, this.type);
            }
            catch (ex) {
                this.addError("resolve", ex.message);
                console.error(chalk_1.default.red(ex.stack));
            }
        });
    }
}
exports.RecordValidator = RecordValidator;
//# sourceMappingURL=record.js.map