"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const chalk_1 = __importDefault(require("chalk"));
class AWS {
    constructor() {
        this.r53 = new aws_sdk_1.Route53();
    }
    async getDomains() {
        const zones = await this.getZones();
        const result = [];
        console.log(`AWS Zones Found: ${zones.HostedZones.length}`);
        for (const zone of zones.HostedZones) {
            const resourceRecordSetResponse = await this.getResources(zone);
            for (const recordSet of resourceRecordSetResponse.ResourceRecordSets) {
                result.push(recordSet.Name);
            }
        }
        return result;
    }
    async getZones() {
        console.log(chalk_1.default.gray(`Getting AWS Zones`));
        return new Promise((resolve, reject) => {
            const params = {};
            this.r53.listHostedZones(params, (err, data) => {
                if (err) {
                    console.error(chalk_1.default.red(`aws.getZones: ${err}`));
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    async getResources(zone) {
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
    }
}
exports.AWS = AWS;
//# sourceMappingURL=aws.js.map