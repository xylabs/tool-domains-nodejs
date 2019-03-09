"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
class AWS {
    constructor() {
        this.r53 = new aws_sdk_1.Route53();
    }
    getDomains() {
        return __awaiter(this, void 0, void 0, function* () {
            const zones = yield this.getZones();
            const result = [];
            console.log(`AWS Zones Found: ${zones.HostedZones.length}`);
            for (const zone of zones.HostedZones) {
                const resourceRecordSetResponse = yield this.getResources(zone);
                for (const recordSet of resourceRecordSetResponse.ResourceRecordSets) {
                    result.push(recordSet.Name);
                }
            }
            return result;
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
}
exports.AWS = AWS;
//# sourceMappingURL=aws.js.map