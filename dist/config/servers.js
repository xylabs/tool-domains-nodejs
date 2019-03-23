"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const records_1 = require("./records");
const record_1 = require("./record");
const lodash_1 = __importDefault(require("lodash"));
class ServersConfig extends Array {
    concat(servers) {
        for (const server of servers) {
            const serverConfig = Object.assign(new server_1.ServerConfig(server.name), server);
            this.push(serverConfig);
        }
        return this;
    }
    getConfig(serverType) {
        let result = new server_1.ServerConfig(serverType);
        const map = this.getMap();
        result = lodash_1.default.merge(result, map.get("default"));
        result = lodash_1.default.merge(result, map.get(serverType));
        // make sure it is a full object
        let records = new records_1.RecordsConfig();
        records = lodash_1.default.merge(records, result.records);
        result.records = records;
        return result;
    }
    getRecordConfig(serverType, recordType) {
        let defaultRecordConfig = new record_1.RecordConfig(recordType);
        let serverRecordConfig = new record_1.RecordConfig(recordType);
        const defaultConfig = this.getConfig("default");
        const serverConfig = this.getConfig(serverType);
        if (defaultConfig && defaultConfig.records) {
            defaultRecordConfig = defaultConfig.records.getConfig(recordType);
        }
        if (serverConfig && serverConfig.records) {
            serverRecordConfig = serverConfig.records.getConfig(recordType);
        }
        return lodash_1.default.merge(defaultRecordConfig, serverRecordConfig);
    }
    getMap() {
        const map = new Map();
        for (const server of this) {
            map.set(server.name, server);
        }
        return map;
    }
}
exports.ServersConfig = ServersConfig;
//# sourceMappingURL=servers.js.map