"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const assert_1 = __importDefault(require("assert"));
const lodash_1 = __importDefault(require("lodash"));
const webcall_1 = require("./webcall");
const configs_1 = require("./configs");
const value_1 = require("./value");
class RecordConfig extends config_1.Config {
    static parse(source, domain) {
        let srcObj = source;
        if (typeof source === "string") {
            srcObj = JSON.parse(source);
        }
        assert_1.default(typeof srcObj.type === "string");
        assert_1.default(domain);
        let record = new RecordConfig(srcObj.type, domain);
        record = lodash_1.default.merge(record, srcObj);
        record.webcalls = new configs_1.Configs();
        if (srcObj.webcalls) {
            for (const webcall of srcObj.webcalls) {
                const newWebcallObj = webcall_1.WebcallConfig.parse(webcall);
                record.webcalls.set(newWebcallObj.protocol, newWebcallObj);
            }
        }
        record.values = new configs_1.Configs();
        if (srcObj.values) {
            for (const value of srcObj.values) {
                const newValueObj = value_1.ValueConfig.parse(value);
                record.values.set(newValueObj.name, newValueObj);
            }
        }
        return record;
    }
    constructor(type, domain) {
        super(type);
        this.type = type;
        this.domain = domain;
    }
    merge(config) {
        if (config) {
            const type = this.type;
            const domain = this.domain;
            let values = new configs_1.Configs();
            values = values.merge(this.values);
            values = values.merge(config.values);
            let newItem = new RecordConfig(type, domain);
            newItem = lodash_1.default.merge(newItem, config);
            newItem.values = values;
            newItem.type = type;
            newItem.domain = domain;
            return newItem;
        }
        return this;
    }
}
exports.RecordConfig = RecordConfig;
//# sourceMappingURL=record.js.map