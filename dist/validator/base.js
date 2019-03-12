"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
class BaseValidator {
    constructor(name) {
        this.name = name;
    }
    addError(err) {
        this.errors = this.errors || [];
        this.errors.push(err);
    }
    async getHttpResponse(ssl = false, timeout = 1000) {
        const prefix = ssl ? "https" : "http";
        const func = ssl ? https_1.default : http_1.default;
        return new Promise((resolve, reject) => {
            try {
                func.get(`${prefix}://${this.name}`, { timeout }, (res) => {
                    resolve(`${res.statusCode}`);
                }).on('error', (e) => {
                    resolve(e.message);
                }).setTimeout(timeout, () => {
                    resolve(`Timeout [${timeout}]`);
                });
            }
            catch (ex) {
                resolve(`${ex.message}: ${this.name}`);
            }
        });
    }
}
exports.BaseValidator = BaseValidator;
//# sourceMappingURL=base.js.map