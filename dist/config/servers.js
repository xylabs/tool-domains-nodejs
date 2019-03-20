"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const records_1 = require("./records");
class ServersConfig extends Array {
    concat(servers) {
        for (const server of servers) {
            const serverConfig = Object.assign(new server_1.ServerConfig(server.name), server);
            this.push(serverConfig);
        }
        return this;
    }
    getConfig(serverType) {
        const result = new server_1.ServerConfig(serverType);
        const map = this.getMap();
        Object.assign(result, map.get("default"));
        Object.assign(result, map.get(serverType));
        result.name = serverType;
        // make sure it is a full object
        const records = new records_1.RecordsConfig();
        Object.assign(records, result.records);
        result.records = records;
        return result;
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