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
const aws_sdk_1 = require("aws-sdk");
const dns_1 = __importDefault(require("dns"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
class XyDomainScan {
    constructor() {
        this.r53 = new aws_sdk_1.Route53();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Running...");
            const zones = yield this.getZones();
            const result = {
                Zones: Array()
            };
            for (const zone of zones.HostedZones) {
                const recordSetArray = [];
                const zoneData = {
                    Info: zone,
                    ResourceRecordSets: recordSetArray
                };
                const resourceRecordSetResponse = yield this.getResources(zone);
                for (const recordSet of resourceRecordSetResponse.ResourceRecordSets) {
                    const resourceRecordData = {
                        RecordSet: recordSet,
                        Validation: yield this.validateRecordSet(recordSet)
                    };
                    zoneData.ResourceRecordSets.push(resourceRecordData);
                }
                result.Zones.push(zoneData);
            }
            this.saveToFile(result);
        });
    }
    getZones() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const params = {};
                this.r53.listHostedZones(params, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    getResources(zone) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const params = {
                    HostedZoneId: zone.Id
                };
                this.r53.listResourceRecordSets(params, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    getHttpResponse(url, ssl = false, timeout = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = ssl ? "https" : "http";
            const func = ssl ? https_1.default : http_1.default;
            return new Promise((resolve, reject) => {
                try {
                    func.get(`${prefix}://${url}`, { timeout }, (res) => {
                        resolve(`${res.statusCode}`);
                    }).on('error', (e) => {
                        resolve(e.message);
                    }).setTimeout(timeout, () => {
                        resolve(`Timeout [${timeout}]`);
                    });
                }
                catch (ex) {
                    resolve(`${ex.message}: ${url}`);
                }
            });
        });
    }
    reverseDns(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                dns_1.default.reverse(address, (errReverse, hostnames) => {
                    const result = {};
                    result.reverseDns = {};
                    if (errReverse) {
                        result.reverseDns.error = errReverse;
                    }
                    else {
                        result.reverseDns.hostNames = hostnames;
                    }
                    resolve(result);
                });
            });
        });
    }
    validateRecordSet_A_CNAME(recordSet) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const result = {};
                dns_1.default.lookup(recordSet.Name, { all: true }, (err, addresses) => {
                    if (err) {
                        console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`);
                        resolve(result);
                    }
                    else {
                        (() => __awaiter(this, void 0, void 0, function* () {
                            result.http = yield this.getHttpResponse(recordSet.Name);
                            result.https = yield this.getHttpResponse(recordSet.Name, true);
                            result.reverseDns = yield this.reverseDns(addresses[0].address);
                            console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`);
                            resolve(result);
                        }))();
                    }
                });
            });
        });
    }
    validateRecordSet_MX(recordSet) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const result = {};
                dns_1.default.lookup(recordSet.Name, { all: true }, (err, addresses) => {
                    if (err) {
                        console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`);
                        resolve(result);
                    }
                    else {
                        (() => __awaiter(this, void 0, void 0, function* () {
                            result.reverseDns = yield this.reverseDns(addresses[0].address);
                            console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`);
                            resolve(result);
                        }))();
                    }
                });
            });
        });
    }
    validateRecordSet(recordSet) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (recordSet.Type) {
                case 'A':
                case 'CNAME':
                    return this.validateRecordSet_A_CNAME(recordSet);
                case 'MX':
                    return this.validateRecordSet_MX(recordSet);
                default:
                    return {};
            }
        });
    }
    saveToFile(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.default.open('output.json', 'w', (err, fd) => {
                if (err) {
                    console.log(`failed to open file: ${err}`);
                }
                else {
                    fs_1.default.write(fd, JSON.stringify(obj), (errWrite) => {
                        if (errWrite) {
                            console.log(`failed to write file: ${errWrite}`);
                        }
                    });
                }
            });
        });
    }
}
exports.XyDomainScan = XyDomainScan;
//# sourceMappingURL=index.js.map