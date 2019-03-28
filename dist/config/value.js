"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const lodash_1 = __importDefault(require("lodash"));
class ValueConfig extends config_1.Config {
    static parse(source) {
        let srcObj = source;
        if (typeof source === "string") {
            srcObj = JSON.parse(source);
        }
        let value = new ValueConfig(srcObj.name);
        value = lodash_1.default.merge(value, srcObj);
        return value;
    }
    constructor(name) {
        super(name);
        this.name = name;
    }
    toString() {
        if (this.name) {
            return this.name;
        }
        if (typeof this.filter === "object") {
            return JSON.stringify(this.filter);
        }
        return this.filter;
    }
}
exports.ValueConfig = ValueConfig;
//# sourceMappingURL=value.js.map