"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RecordConfig {
    constructor(name) {
        this.name = name;
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