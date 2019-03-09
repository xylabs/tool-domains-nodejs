"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns_1 = __importDefault(require("dns"));
class DNS {
    static async lookup(name) {
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
    }
    static async resolveAny(name) {
        return new Promise((resolve, reject) => {
            dns_1.default.resolveAny(name, (err, records) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(records);
                }
            });
        });
    }
    static async reverse(address) {
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
    }
}
exports.DNS = DNS;
//# sourceMappingURL=dns.js.map