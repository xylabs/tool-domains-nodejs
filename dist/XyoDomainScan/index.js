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
class XyoDomainScan {
    constructor() {
        this.r53 = new aws_sdk_1.Route53();
    }
    getZones() {
        return __awaiter(this, void 0, void 0, function* () {
            let self = this;
            return new Promise((resolve, reject) => {
                let params = { MaxItems: '1000' };
                this.r53.listHostedZones(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
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
            let self = this;
            return new Promise((resolve, reject) => {
                let params = {
                    HostedZoneId: zone.Id,
                    MaxItems: '1000'
                };
                this.r53.listResourceRecordSets(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Running...");
            this.router53Data = (yield this.getZones());
            if (this.router53Data) {
                this.router53Data.HostedZones.forEach((zone) => __awaiter(this, void 0, void 0, function* () {
                    let resources = yield this.getResources(zone);
                    console.log(resources);
                }));
            }
        });
    }
}
exports.XyoDomainScan = XyoDomainScan;
//# sourceMappingURL=index.js.map