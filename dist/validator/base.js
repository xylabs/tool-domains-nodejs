"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const error_1 = require("./error");
class BaseValidator {
    constructor(name) {
        this.name = name;
    }
    addError(action, error) {
        this.errors = this.errors || [];
        this.errors.push(new error_1.ValidationError(action, error));
        console.error(chalk_1.default.red(`${action}: ${error}`));
    }
    addErrors(errors) {
        if (errors) {
            this.errors = this.errors || [];
            this.errors = this.errors.concat(errors);
        }
    }
}
exports.BaseValidator = BaseValidator;
//# sourceMappingURL=base.js.map