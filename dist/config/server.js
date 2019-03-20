"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const records_1 = require("./records");
class ServerConfig {
    constructor(name) {
        this.name = name;
        this.records = new records_1.RecordsConfig().concat(this.records || []);
    }
}
exports.ServerConfig = ServerConfig;
//# sourceMappingURL=server.js.map