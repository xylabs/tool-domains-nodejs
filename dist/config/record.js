"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class RecordConfig extends base_1.Base {
    constructor(type) {
        super();
        this.type = type;
    }
    isEnabled() {
        if (this.enabled !== undefined) {
            return this.enabled;
        }
        return true;
    }
}
exports.RecordConfig = RecordConfig;
//# sourceMappingURL=record.js.map