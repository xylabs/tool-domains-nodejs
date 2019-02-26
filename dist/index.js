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
const util_1 = require("util");
class XyDomainScan {
    constructor() {
        this.r53 = new aws_sdk_1.Route53();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const zones = yield this.getZones();
            const result = {
                Zones: Array()
            };
            console.log(`Zones Found: ${zones.HostedZones.length}`);
            let completedZones = 0;
            const zoneCount = zones.HostedZones.length;
            for (const zone of zones.HostedZones) {
                completedZones++;
                console.log(`Processing Zone: ${zone.Name}: [${completedZones}/${zoneCount}]`);
                const recordSetArray = [];
                const zoneData = {
                    Info: zone,
                    ResourceRecordSets: recordSetArray
                };
                const resourceRecordSetResponse = yield this.getResources(zone);
                let completedRecordSets = 0;
                const recordSetCount = resourceRecordSetResponse.ResourceRecordSets.length;
                for (const recordSet of resourceRecordSetResponse.ResourceRecordSets) {
                    completedRecordSets++;
                    console.log(`Zone:[${completedZones}/${zoneCount}] Record:[${completedRecordSets}/${recordSetCount}]: ${recordSet.Name}`);
                    const resourceRecordData = {
                        RecordSet: recordSet,
                        Validation: yield this.validateRecordSet(recordSet)
                    };
                    zoneData.ResourceRecordSets.push(resourceRecordData);
                }
                result.Zones.push(zoneData);
            }
            console.log(`Saving to File: output.json`);
            this.saveToFile("output.json", result);
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
    reverseDns(addresses) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (util_1.isArray(addresses)) {
                    dns_1.default.reverse(addresses[0], (err, hostNames) => {
                        resolve({ err, hostNames });
                    });
                }
                else {
                    resolve({ err: "Invalid Address" });
                }
            });
        });
    }
    dnsLookup(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                dns_1.default.lookup(name, { all: true }, (err, addresses) => {
                    resolve({ err, addresses });
                });
            });
        });
    }
    validateRecordSet_A_CNAME(recordSet) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {};
            result.addresses = yield this.dnsLookup(recordSet.Name);
            result.http = yield this.getHttpResponse(recordSet.Name);
            result.https = yield this.getHttpResponse(recordSet.Name, true);
            result.reverseDns = yield this.reverseDns(result.addresses);
            return result;
        });
    }
    validateRecordSet_MX(recordSet) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {};
            result.addresses = yield this.dnsLookup(recordSet.Name);
            result.reverseDns = yield this.reverseDns(result.addresses);
            return result;
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
    saveToFile(filename, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.default.open(filename, 'w', (err, fd) => {
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