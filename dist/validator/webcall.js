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
const axios_1 = __importDefault(require("axios"));
const html_validator_1 = __importDefault(require("html-validator"));
class WebcallValidator extends validator_1.Validator {
    constructor(config, address) {
        super(config);
        this.address = address;
    }
    validate() {
        const _super = Object.create(null, {
            validate: { get: () => super.validate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let callTime = Date.now();
                const response = yield this.get(this.config.protocol, this.address);
                callTime = Date.now() - callTime;
                if (response.status) {
                    this.headers = response.headers;
                    this.statusCode = response.status;
                    this.statusMessage = response.statusText;
                    if (this.config.callTimeMax && this.callTime) {
                        if (this.callTime > this.config.callTimeMax) {
                            this.addError("validate", `Call too slow: ${this.callTime}ms [Expected < ${this.config.callTimeMax}ms]`);
                        }
                    }
                    if (this.headers && this.config.headers) {
                        yield this.validateHeaders(this.config.headers);
                    }
                    const expectedCode = this.config.statusCode || 200;
                    if (this.statusCode !== expectedCode) {
                        this.addError("validate", `Unexpected Response Code: ${this.statusCode} [Expected: ${expectedCode}]`);
                    }
                    else {
                        if (this.config.html) {
                            if (this.statusCode === 200) {
                                yield this.validateHtml(response.data);
                            }
                        }
                    }
                }
                else {
                    this.addError("validate", `Failed to get Response: ${response.code}: ${response.message}`);
                }
            }
            catch (ex) {
                this.addError("validate", ex.message);
                console.error(ex.stack);
            }
            return _super.validate.call(this);
        });
    }
    validateHeaders(expected) {
        if (this.headers) {
            if (Array.isArray(expected)) {
                for (const item of expected) {
                    const value = this.headers[item.name];
                    if (item.required && value === undefined) {
                        this.addError("validateHeaders", `Missing: ${item.name}`);
                    }
                    else if (value === undefined) {
                        if (item.value === undefined) {
                            this.addError("validateHeaders", `Invalid Value Configured: ${item.name}`);
                        }
                        else {
                            if (!item.value.match(this.headers[item.name])) {
                                this.addError("validateHeaders", `Invalid Value [${item.name}]: ${this.headers[item.name]} [Expected: ${item.value}]`);
                            }
                        }
                    }
                }
            }
        }
        else {
            this.addError("validateHeaders", "No headers found");
        }
    }
    validateHtml(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield html_validator_1.default({
                data,
                format: 'json'
            });
            for (const item of results.messages) {
                if (item.type === "error") {
                    this.addError("validateHtml", `[L:${item.lastLine}, C:${item.lastColumn}]: ${item.message}`);
                }
            }
            return results.messages;
        });
    }
    get(protocol, address) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeout = this.config.timeout || 1000;
            let response;
            try {
                response = yield axios_1.default.get(`${protocol}://${this.address}`, {
                    responseType: 'text',
                    maxRedirects: 0,
                    validateStatus: (status) => true,
                    transformResponse: (data) => data,
                    timeout, headers: {
                        Host: this.config.host
                    }
                });
            }
            catch (ex) {
                this.addError("get", `Failed [${protocol}://${this.address}]:${ex.code}`);
                response = {
                    code: ex.code,
                    message: ex.message
                };
            }
            return response;
        });
    }
}
exports.WebcallValidator = WebcallValidator;
//# sourceMappingURL=webcall.js.map