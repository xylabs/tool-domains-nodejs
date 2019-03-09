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
class DNS {
    static lookup(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                dns_1.default.lookup(name, { all: true }, (err, addresses) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({ err, addresses });
                    }
                });
            });
        });
    }
    static resolveAny(name) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    static reverse(addresses) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (addresses.length > 0) {
                    dns_1.default.reverse(addresses[0], (err, hostNames) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(hostNames);
                        }
                    });
                }
                else {
                    reject("Need at least one address");
                }
            });
        });
    }
}
exports.DNS = DNS;
//# sourceMappingURL=dns.js.map