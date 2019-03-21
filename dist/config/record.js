"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RecordConfig {
    constructor(type) {
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