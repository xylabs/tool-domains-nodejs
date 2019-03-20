"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base");
const dns_1 = require("../../dns");
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const chalk_1 = __importDefault(require("chalk"));
class RecordValidator extends base_1.BaseValidator {
    constructor(config, name, type) {
        super(config, name);
        this.type = type;
    }
    getRecordConfig() {
        return this.config.getRecordConfig(this.name, this.type);
    }
    async checkHttp(ip, hostname, timeout) {
        try {
            const result = await this.getHttpResponse(ip, hostname, timeout, false);
            this.validateHttpHeaders(result.headers, ip);
            console.log(chalk_1.default.gray(`http[${timeout}]: ${ip}: ${result.statusCode}`));
            return result;
        }
        catch (ex) {
            this.addError("http", ex);
        }
    }
    async checkHttps(ip, hostname, timeout) {
        try {
            const result = await this.getHttpResponse(ip, hostname, timeout, true);
            this.validateHttpsHeaders(result.headers, ip);
            console.log(chalk_1.default.gray(`https[${timeout}]: ${ip}: ${result.statusCode}`));
            return result;
        }
        catch (ex) {
            this.addError("https", ex);
        }
    }
    async reverseLookup(ip, hostname, timeout) {
        // right now we only check for cloudfront
        try {
            const names = await dns_1.DNS.reverse(ip);
            let found = false;
            for (const name of names) {
                if (name.endsWith('.r.cloudfront.net')) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                this.addError("reverseLookup", `ReverseDNS Mismatch ${names.join(',')} [Expected: '*.r.cloudfront.net']`);
            }
        }
        catch (ex) {
            this.addError("reverseLookup", `${ex}`);
        }
    }
    validateHttpHeaders(headers, ip) {
        let errorCount = 0;
        if (headers.location === undefined) {
            errorCount += this.validateHeader("http", ip, headers, "location", true);
        }
        return errorCount;
    }
    // if value is undefined, we assume that it is a wildcard
    validateHeader(action, ip, headers, headerName, required, value) {
        if (headers[headerName] === undefined) {
            if (required) {
                this.addError(action, `Missing header [${this.name}/${ip}]: ${headerName}`);
                return 1;
            }
        }
        else {
            if (value) {
                if (headers[headerName] !== value) {
                    this.addError(action, `Incorrect header value [${this.name}/${ip}]: [${headerName}]: ${headers[headerName]} [Expected: ${value}]`);
                    return 1;
                }
            }
        }
        return 0;
    }
    validateHttpsHeaders(headers, ip) {
        let errorCount = 0;
        errorCount += this.validateHeader("https", ip, headers, "content-type", true);
        errorCount += this.validateHeader("https", ip, headers, "content-security-policy", true, "object-src 'none'");
        errorCount += this.validateHeader("https", ip, headers, "x-content-type-options", true, "nosniff");
        errorCount += this.validateHeader("https", ip, headers, "x-frame-options", true, "DENY");
        errorCount += this.validateHeader("https", ip, headers, "x-xss-protection", true, "1; mode=block");
        errorCount += this.validateHeader("https", ip, headers, "referrer-policy", true, "same-origin");
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
                    reject(`Timeout [${this.name}]: ${timeout}`);
                });
            }
            catch (ex) {
                this.addError("getHttpResponse", `[${this.name}]: ${ex}`);
                reject(ex);
            }
        });
    }
}
exports.RecordValidator = RecordValidator;
//# sourceMappingURL=base.js.map