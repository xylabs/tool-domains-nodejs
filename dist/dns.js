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
const dns_1 = __importDefault(require("dns"));
const dnsclient_1 = require("./dnsclient");
class Dns {
    static lookup(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                dns_1.default.lookup(name, 4, (err, address) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(address);
                    }
                });
            });
        });
    }
    static resolve(domain, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.resolve(domain, type);
            const items = [];
            for (const answer of result.answers) {
                if (answer.type === type) {
                    items.push(answer);
                }
            }
            return items;
        });
    }
    static resolve4(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                dns_1.default.resolve4(name, (err, records) => {
                    if (err) {
                        if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
                            reject(err);
                        }
                        else {
                            resolve([]);
                        }
                    }
                    else {
                        resolve(records);
                    }
                });
            });
        });
    }
    static resolveCname(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                dns_1.default.resolveCname(name, (err, records) => {
                    if (err) {
                        if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
                            reject(err);
                        }
                        else {
                            resolve([]);
                        }
                    }
                    else {
                        resolve(records);
                    }
                });
            });
        });
    }
    static resolveMx(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                dns_1.default.resolveMx(name, (err, records) => {
                    if (err) {
                        if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
                            reject(err);
                        }
                        else {
                            resolve([]);
                        }
                    }
                    else {
                        resolve(records);
                    }
                });
            });
        });
    }
    static resolveTxt(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                dns_1.default.resolveTxt(name, (err, records) => {
                    if (err) {
                        if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
                            reject(err);
                        }
                        else {
                            resolve([]);
                        }
                    }
                    else {
                        resolve(records);
                    }
                });
            });
        });
    }
    static reverse(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                dns_1.default.reverse(address, (err, hostNames) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(hostNames);
                    }
                });
            });
        });
    }
}
Dns.client = new dnsclient_1.DnsClient();
exports.Dns = Dns;
//# sourceMappingURL=dns.js.map