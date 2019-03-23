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
const chalk_1 = __importDefault(require("chalk"));
class AWS {
    constructor() {
        this.r53 = new aws_sdk_1.Route53();
        this.s3 = new aws_sdk_1.S3();
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
    saveFileToS3(bucket, filename, data) {
        console.log(chalk_1.default.gray(`Saving to S3`));
        return new Promise((resolve, reject) => {
            const buffer = Buffer.from(JSON.stringify(data));
            const params = {
                Bucket: bucket,
                Key: filename,
                Body: buffer,
                ContentType: "application/json"
            };
            this.s3.upload(params, (err, result) => {
                if (err) {
                    console.error(chalk_1.default.red(`aws.saveFileToS3: ${err}`));
                    reject(err);
                }
                else {
                    console.log(chalk_1.default.gray(`Saved to S3: ${filename}`));
                    resolve(result);
                }
            });
        });
    }
    getZones() {
        return __awaiter(this, void 0, void 0, function* () {
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