"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
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