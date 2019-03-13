"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
const dns_1 = require("../../dns");
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
class RecordValidator extends base_1.BaseValidator {
    constructor(name, type) {
        super(name);
        this.type = type;
    }
    async validate(timeout) {
        if (this.errors) {
            return this.errors.length;
        }
        return 0;
    }
    async checkHttp(timeout) {
        try {
            this.http = await this.getHttpResponse(false, timeout);
        }
        catch (ex) {
            this.addError("http", ex);
        }
    }
    async checkHttps(timeout) {
        try {
            this.https = await this.getHttpResponse(true, timeout);
        }
        catch (ex) {
            this.addError("https", ex);
        }
    }
    async lookup() {
        try {
            this.addresses = await dns_1.DNS.lookup(this.name);
        }
        catch (ex) {
            this.addError("lookup", ex);
        }
    }
    async reverseLookup() {
        try {
            this.reverseDns = await dns_1.DNS.reverse(this.name);
        }
        catch (ex) {
            this.addError("reverseLookup", ex);
        }
    }
    async getHttpResponse(ssl = false, timeout = 5000) {
        const prefix = ssl ? "https" : "http";
        const func = ssl ? https_1.default : http_1.default;
        return new Promise((resolve, reject) => {
            try {
                func.get(`${prefix}://${this.name}`, { timeout }, (res) => {
                    resolve(`${res.statusCode}`);
                }).on('error', (e) => {
                    reject(e.message);
                }).setTimeout(timeout, () => {
                    reject(`Timeout [${timeout}]`);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
}
exports.RecordValidator = RecordValidator;
//# sourceMappingURL=base.js.map