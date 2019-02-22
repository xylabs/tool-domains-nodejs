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
class XyoDomainScan {
    constructor() {
        this.r53 = new aws_sdk_1.Route53();
    }
    getZones() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let params = {};
                this.r53.listHostedZones(params, function (err, data) {
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
                let params = {
                    HostedZoneId: zone.Id
                };
                this.r53.listResourceRecordSets(params, function (err, data) {
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
    getHttpResponse(url, timeout = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    http_1.default.get(`http://${url}`, { timeout }, (res) => {
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
    getHttpsResponse(url, timeout = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    https_1.default.get(`https://${url}`, { timeout }, (res) => {
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
    validateRecordSet_A_CNAME(recordSet) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let result = {};
                dns_1.default.lookup(recordSet.Name, { all: true }, (err, addresses) => {
                    if (err) {
                        console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`);
                        resolve(result);
                    }
                    else {
                        (() => __awaiter(this, void 0, void 0, function* () {
                            result.http = yield this.getHttpResponse(recordSet.Name);
                            result.https = yield this.getHttpsResponse(recordSet.Name);
                            dns_1.default.reverse(addresses[0].address, (err, hostnames) => {
                                result.reverseDns = {};
                                if (err) {
                                    result.reverseDns.error = err;
                                }
                                else {
                                    result.reverseDns.hostNames = hostnames;
                                }
                                console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`);
                                resolve(result);
                            });
                        }))();
                    }
                });
            });
        });
    }
    validateRecordSet_MX(recordSet) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let result = {};
                dns_1.default.lookup(recordSet.Name, { all: true }, (err, addresses) => {
                    if (err) {
                        console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`);
                        resolve(result);
                    }
                    else {
                        dns_1.default.reverse(addresses[0].address, (err, hostnames) => {
                            result.reverseDns = {};
                            if (err) {
                                result.reverseDns.error = err;
                            }
                            else {
                                result.reverseDns.hostNames = hostnames;
                            }
                            console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`);
                            resolve(result);
                        });
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
                    fs_1.default.write(fd, JSON.stringify(obj), (err) => {
                        if (err) {
                            console.log(`failed to write file: ${err}`);
                        }
                    });
                }
            });
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Running...");
            let zones = yield this.getZones();
            let result = {
                Zones: Array()
            };
            for (let zone of zones.HostedZones) {
                let zoneData = {
                    Info: zone,
                    ResourceRecordSets: new Array()
                };
                let resourceRecordSetResponse = yield this.getResources(zone);
                for (let recordSet of resourceRecordSetResponse.ResourceRecordSets) {
                    let resourceRecordData = {
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
}
exports.XyoDomainScan = XyoDomainScan;
//# sourceMappingURL=index.js.map