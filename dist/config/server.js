"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const config_1 = require("./config");
const configs_1 = require("./configs");
const record_1 = require("./record");
const chalk_1 = __importDefault(require("chalk"));
const assert_1 = __importDefault(require("assert"));
class ServerConfig extends config_1.Config {
    static parse(source) {
        let srcObj = source;
        if (typeof source === "string") {
            srcObj = JSON.parse(source);
        }
        assert_1.default(typeof srcObj.name === "string");
        let server = new ServerConfig(srcObj.name);
        server = lodash_1.default.merge(server, srcObj);
        server.records = new configs_1.Configs();
        if (srcObj.records) {
            for (const record of srcObj.records) {
                const newRecordObj = record_1.RecordConfig.parse(record, "default");
                server.records.set(newRecordObj.type, newRecordObj);
            }
        }
        return server;
    }
    constructor(name) {
        super();
        this.name = name;
        this.records = new configs_1.Configs();
    }
    getKey() {
        return this.name;
    }
    merge(config) {
        if (config) {
            const name = this.name;
            const records = this.records;
            let newItem = new ServerConfig(name);
            newItem = lodash_1.default.merge(newItem, config);
            newItem.records = lodash_1.default.merge(newItem.records, records);
            newItem.name = name;
            console.log(chalk_1.default.gray(`server.merge[${config.name}]: ${newItem.records}`));
            return newItem;
        }
        return this;
    }
}
exports.ServerConfig = ServerConfig;
//# sourceMappingURL=server.js.map