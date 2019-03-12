"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class DomainResult extends base_1.BaseResult {
    constructor() {
        super(...arguments);
        this.records = [];
    }
    validate(config) {
        return this;
    }
}
exports.DomainResult = DomainResult;
//# sourceMappingURL=domain.js.map