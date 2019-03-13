"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chalk");
class BaseValidator {
    constructor(name) {
        this.name = name;
    }
    addError(action, error) {
        this.errors = this.errors || [];
        this.errors.push({ action, error });
    }
}
exports.BaseValidator = BaseValidator;
//# sourceMappingURL=base.js.map