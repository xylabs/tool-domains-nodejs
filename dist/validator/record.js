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
const assert_1 = __importDefault(require("assert"));
const html_validator_1 = __importDefault(require("html-validator"));
const axios_1 = __importDefault(require("axios"));
class RecordValidator extends validator_1.Validator {
    constructor(config) {
        super(config);
        this.records = [];
        this.type = config.type;
        this.domain = config.domain;
    }
    validate() {
        const _super = Object.create(null, {
            validate: { get: () => super.validate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.type.split('|').length === 1) {
                this.records = yield this.resolve();
                if (this.config.http) {
                    if (((this.config.http.enabled === undefined) && true) || this.config.http.enabled) {
                        this.http = yield this.checkAllHttp(this.config.http);
                    }
                    if (this.config.https) {
                        if (((this.config.https.enabled === undefined) && true) || this.config.https.enabled) {
                            this.http = yield this.checkAllHttps(this.config.https);
                        }
                    }
                }
                if (this.config.reverseDNS) {
                    if (((this.config.reverseDNS.enabled === undefined) && true) || this.config.reverseDNS.enabled) {
                        this.reverseDns = yield this.reverseLookup(this.config.reverseDNS.value);
                    }
                }
            }
            return _super.validate.call(this);
        });
    }
    checkAllHttp(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            if (config) {
                let enabled = true;
                if (config.enabled !== undefined) {
                    enabled = config.enabled;
                }
                if (enabled) {
                    for (const record of this.records.values()) {
                        result.push(yield this.checkHttp(record));
                    }
                }
            }
            return result;
        });
    }
    checkAllHttps(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            if (config) {
                let enabled = true;
                if (config.enabled !== undefined) {
                    enabled = config.enabled;
                }
                if (enabled) {
                    for (const record of this.records.values()) {
                        result.push(yield this.checkHttps(record));
                    }
                }
            }
            return result;
        });
    }
    validateHtml(data, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield html_validator_1.default({
                data,
                format: 'json'
            });
            for (const item of results.messages) {
                if (item.type === "error") {
                    this.addError("html", `[L:${item.lastLine}, C:${item.lastColumn}, ${ip}]: ${item.message}`);
                }
            }
            return results.messages;
        });
    }
    get(prefix, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeout = this.config.timeout || 1000;
            let response;
            try {
                response = yield axios_1.default.get(`${prefix}${ip}`, {
                    responseType: 'text',
                    maxRedirects: 0,
                    validateStatus: (status) => true,
                    transformResponse: (data) => data,
                    timeout, headers: {
                        Host: this.config.domain
                    }
                });
            }
            catch (ex) {
                this.addError("get", `Failed [${prefix}${ip}]:${ex.code}`);
                response = {
                    code: ex.code,
                    message: ex.message
                };
            }
            return response;
        });
    }
    checkHttp(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeout = this.config.timeout || 1000;
            const result = {
                ip: value
            };
            try {
                this.http = this.http || [];
                assert_1.default(value !== undefined);
                let callTime = Date.now();
                const response = yield this.get("http://", value);
                callTime = Date.now() - callTime;
                if (response.status) {
                    result.headers = response.headers;
                    result.statusCode = response.status;
                    result.statusMessage = response.statusText;
                    if (this.config.http) {
                        if (this.config.http.callTimeMax) {
                            if (result.callTime > this.config.http.callTimeMax) {
                                this.addError("https", `Call too slow [${value}]: ${result.callTime}ms [Expected < ${this.config.http.callTimeMax}ms]`);
                            }
                        }
                        if (result.headers && this.config.http.headers) {
                            yield this.validateHeaders(this.config.http.headers, result.headers);
                        }
                        result.ip = value;
                        this.http.push(result);
                        const expectedCode = this.config.http.statusCode || 200;
                        if (result.statusCode !== expectedCode) {
                            this.addError("http", `Unexpected Response Code [${value}]: ${result.statusCode} [Expected: ${expectedCode}]`);
                        }
                        else {
                            if (this.config.html) {
                                if (result.statusCode === 200) {
                                    yield this.validateHtml(response.data, value);
                                }
                            }
                        }
                    }
                    // we do not want to add the data to the result
                    result.data = undefined;
                }
                else {
                    this.addError("http", `Failed to get Response [${value}]: ${response.code}: ${response.message}`);
                }
            }
            catch (ex) {
                this.addError("RecordValidator.checkHttp", ex);
                console.error(ex.stack);
            }
            return result;
        });
    }
    checkHttps(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeout = this.config.timeout || 1000;
            const result = {
                ip: value
            };
            try {
                this.https = this.https || [];
                assert_1.default(value !== undefined);
                let callTime = Date.now();
                const response = yield this.get("https://", value);
                callTime = Date.now() - callTime;
                if (response.status) {
                    result.headers = response.headers;
                    result.statusCode = response.status;
                    result.statusMessage = response.statusText;
                    if (this.config.https) {
                        if (this.config.https.callTimeMax) {
                            if (callTime > this.config.https.callTimeMax) {
                                this.addError("https", `Call too slow [${value}]: ${callTime}ms [Expected < ${this.config.https.callTimeMax}ms]`);
                            }
                        }
                        if (result.headers && this.config.https.headers) {
                            yield this.validateHeaders(this.config.https.headers, result.headers);
                        }
                        result.ip = value;
                        this.https.push(result);
                        const expectedCode = this.config.https.statusCode || 200;
                        if (result.statusCode !== expectedCode) {
                            this.addError("https", `Unexpected Response Code [${value}]: ${result.statusCode} [Expected: ${expectedCode}]`);
                        }
                        else {
                            if (result.statusCode === 200) {
                                if (this.config.html) {
                                    yield this.validateHtml(response.data, value);
                                }
                            }
                        }
                    }
                    // we do not want to add the data to the result
                    result.data = undefined;
                }
                else {
                    this.addError("https", `Failed to get Response [${value}]: ${response.code}: ${response.message}`);
                }
            }
            catch (ex) {
                this.addError("RecordValidator.checkHttps", ex.message);
                console.error(chalk_1.default.red(ex.stack));
            }
            return result;
        });
    }
    reverseLookup(value) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                for (const record of this.records.values()) {
                    const domains = yield dns_1.Dns.reverse(record);
                    let valid = true;
                    if (value) {
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
            try {
                if (this.type && this.domain) {
                    return yield dns_1.Dns.resolve(this.domain, this.type);
                }
                this.addError("RecordValidator.resolve", "Missing Type");
            }
            catch (ex) {
                this.addError("RecordValidator.resolve", ex.message);
                console.error(chalk_1.default.red(ex.stack));
            }
            return [];
        });
    }
    validateHeaders(expected, actual) {
        if (Array.isArray(expected)) {
            for (const item of expected) {
                const value = actual[item.name];
                if (item.required && value === undefined) {
                    this.addError("headers", `Missing: ${item.name}`);
                }
                else if (value === undefined) {
                    if (item.value === undefined) {
                        this.addError("headers", `Invalid Value Configured: ${item.name}`);
                    }
                    else {
                        if (!item.value.match(actual[item.name])) {
                            this.addError("headers", `Invalid Value [${item.name}]: ${actual[item.name]} [Expected: ${item.value}]`);
                        }
                    }
                }
            }
        }
    }
}
exports.RecordValidator = RecordValidator;
//# sourceMappingURL=record.js.map