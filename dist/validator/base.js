"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const error_1 = require("./error");
const lodash_1 = __importDefault(require("lodash"));
class BaseValidator {
    constructor(name) {
        this.errorCount = 0;
        this.name = name;
    }
    toJSON() {
        return lodash_1.default.omit(this, ["config"]);
    }
    async validate() {
        if (this.errors) {
            this.errorCount += this.addErrors.length;
        }
        return this.errorCount;
    }
    addError(action, error) {
        this.errors = this.errors || [];
        this.errors.push(new error_1.ValidationError(action, error));
        console.error(chalk_1.default.red(`${action}: ${error}`));
        this.errorCount++;
    }
    addErrors(errors) {
        if (errors) {
            this.errors = this.errors || [];
            this.errors = this.errors.concat(errors);
            this.errorCount += errors.length;
        }
    }
}
exports.BaseValidator = BaseValidator;
//# sourceMappingURL=base.js.map