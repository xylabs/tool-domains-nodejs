"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RecordsConfig {
    isEnabled(type) {
        let value = true;
        const obj = this[type];
        if (obj && obj.enabled !== undefined) {
            value = obj.enabled;
        }
        else if (this.default && this.default.enabled !== undefined) {
            value = this.default.enabled;
        }
        return value;
    }
}
exports.RecordsConfig = RecordsConfig;
//# sourceMappingURL=records.js.map