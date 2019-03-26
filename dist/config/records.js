"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const configs_1 = require("./configs");
class RecordsConfig extends config_1.Config {
    constructor() {
        super(...arguments);
        this.records = new configs_1.Configs();
    }
    merge(config) {
        if (config) {
            this.records = this.records.merge(config.records);
        }
        return this;
    }
}
exports.RecordsConfig = RecordsConfig;
//# sourceMappingURL=records.js.map