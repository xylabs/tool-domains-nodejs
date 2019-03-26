"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const assert_1 = __importDefault(require("assert"));
const lodash_1 = __importDefault(require("lodash"));
class RecordConfig extends config_1.Config {
    static parse(source, domain) {
        let srcObj = source;
        if (typeof source === "string") {
            srcObj = JSON.parse(source);
        }
        assert_1.default(typeof srcObj.type === "string");
        let newObj = new RecordConfig(srcObj.type, domain);
        newObj = lodash_1.default.merge(newObj, srcObj);
        return newObj;
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
            let newItem = new RecordConfig(type, domain);
            newItem = lodash_1.default.merge(newItem, config);
            newItem.type = type;
            newItem.domain = domain;
            return newItem;
        }
        return this;
    }
}
exports.RecordConfig = RecordConfig;
//# sourceMappingURL=record.js.map