"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const records_1 = require("./records");
const lodash_1 = __importDefault(require("lodash"));
class ServerConfig {
    constructor(name, init) {
        this.name = name;
        if (init) {
            for (const obj of init) {
                lodash_1.default.merge(this, obj);
            }
        }
        this.records = new records_1.RecordsConfig().concat(this.records || []);
    }
}
exports.ServerConfig = ServerConfig;
//# sourceMappingURL=server.js.map