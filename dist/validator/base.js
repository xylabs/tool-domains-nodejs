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
    getHttpResponse(ssl = false, timeout = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.BaseValidator = BaseValidator;
//# sourceMappingURL=base.js.map