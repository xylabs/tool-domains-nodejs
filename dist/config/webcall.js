"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const assert_1 = __importDefault(require("assert"));
const lodash_1 = __importDefault(require("lodash"));
class WebcallConfig extends config_1.Config {
    static parse(source, host) {
        let srcObj = source;
        if (typeof source === "string") {
            srcObj = JSON.parse(source);
        }
        assert_1.default(typeof srcObj.protocol === "string");
        let webcall = new WebcallConfig(srcObj.protocol, host);
        webcall = lodash_1.default.merge(webcall, srcObj);
        return webcall;
    }
    constructor(protocol, host) {
        super(protocol);
        this.protocol = protocol;
        this.host = host;
    }
}
exports.WebcallConfig = WebcallConfig;
//# sourceMappingURL=webcall.js.map