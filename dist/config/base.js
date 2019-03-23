"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
class Base {
    merge(config) {
        return lodash_1.default.merge(this, config);
    }
}
exports.Base = Base;
//# sourceMappingURL=base.js.map