"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
class Config {
    constructor(key) {
        this.key = key;
    }
    isEnabled() {
        if (this.enabled === undefined) {
            return true;
        }
        return this.enabled;
    }
    // replace this in derived class for more advanced merge
    merge(config) {
        if (config) {
            return lodash_1.default.merge(this, config);
        }
        return this;
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map