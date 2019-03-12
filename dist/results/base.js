"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseResult {
    constructor(name) {
        this.name = name;
    }
    addError(err) {
        this.errors = this.errors || [];
        this.errors.push(err);
    }
}
exports.BaseResult = BaseResult;
//# sourceMappingURL=base.js.map