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
    async checkHttp(ip, hostname, timeout) {
        try {
            const result = await this.getHttpResponse(ip, hostname, timeout, false);
            this.validateHttpHeaders(result.headers);
            return result;
        }
        catch (ex) {
            this.addError("http", ex);
        }
    }
    async checkHttps(ip, hostname, timeout) {
        try {
            const result = await this.getHttpResponse(ip, hostname, timeout, true);
            this.validateHttpsHeaders(result.headers);
            return result;
        }
        catch (ex) {
            this.addError("https", ex);
        }
    }
    async reverseLookup() {
        try {
            return await dns_1.DNS.reverse(this.name);
        }
        catch (ex) {
            this.addError("reverseLookup", ex);
        }
    }
    validateHttpHeaders(headers) {
        let errorCount = 0;
        if (headers.location === undefined) {
            this.addError("http", "Missing location header");
            errorCount++;
        }
        return errorCount;
    }
    // if value is undefined, we assume that it is a wildcard
    validateHeader(action, headers, name, required, value) {
        if (headers[name] === undefined) {
            if (required) {
                this.addError(action, `Missing header: ${name}`);
                return false;
            }
        }
        else {
            if (value) {
                if (headers[name] !== value) {
                    this.addError(action, `Incorrect header value [${name}]: ${headers[name]} [Expected: ${value}]`);
                    return false;
                }
            }
        }
        return true;
    }
    validateHttpsHeaders(headers) {
        let errorCount = 0;
        if (headers["content-type"] !== "text/html; charset=utf-8") {
            this.addError("http", "Invalid or missing content-type header");
            errorCount++;
        }
        if (headers["content-security-policy"] !== "object-src 'none'") {
            this.addError("http", "Invalid or missing content-security-policy header");
            errorCount++;
        }
        if (headers["content-security-policy"] !== "object-src 'none'") {
            this.addError("http", "Invalid or missing content-security-policy header");
            errorCount++;
        }
        if (headers["x-content-type-options"] !== "nosniff") {
            this.addError("http", "Invalid or missing x-content-type-options header");
            errorCount++;
        }
        if (headers["x-frame-options"] !== "DENY") {
            this.addError("http", "Invalid or missing x-frame-options header");
            errorCount++;
        }
        if (headers["x-xss-protection"] !== "1; mode=block") {
            this.addError("http", "Invalid or missing x-xss-protection header");
            errorCount++;
        }
        if (headers["referrer-policy"] !== "same-origin") {
            this.addError("http", "Invalid or missing referrer-policy header");
            errorCount++;
        }
        return errorCount;
    }
    sanitizeResponse(res, callTime) {
        return {
            httpVersion: res.httpVersion,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            headers: res.headers,
            callTime
        };
    }
    async getHttpResponse(ip, hostname, timeout, ssl = false) {
        const prefix = ssl ? "https" : "http";
        const func = ssl ? https_1.default : http_1.default;
        const startTime = Date.now();
        let bytesRead = 0;
        let result = {};
        return new Promise((resolve, reject) => {
            try {
                const req = func.get(`${prefix}://${ip}`, { hostname, timeout }, (res) => {
                    result = this.sanitizeResponse(res, Date.now() - startTime);
                    result.port = res.socket.remotePort;
                    res.on('data', (data) => {
                        bytesRead += data.length;
                    });
                }).on('error', (e) => {
                    reject(e.message);
                }).on('close', () => {
                    result.bytesRead = bytesRead;
                    resolve(result);
                }).setTimeout(timeout, () => {
                    reject(`Timeout [${timeout}]`);
                });
            }
            catch (ex) {
                this.addError("getHttpResponse", ex);
                reject(ex);
            }
        });
    }
}
exports.RecordValidator = RecordValidator;
//# sourceMappingURL=base.js.map