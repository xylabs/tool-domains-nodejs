"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const error_1 = require("./error");
const lodash_1 = __importDefault(require("lodash"));
const is_circular_1 = __importDefault(require("is-circular"));
class BaseValidator {
    constructor(name) {
        this.errorCount = 0;
        this.name = name;
    }
    toJSON() {
        return lodash_1.default.omit(this, ["config"]);
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            if (is_circular_1.default(this)) {
                this.addError("base", "CIRCULAR");
            }
            if (this.errors) {
                this.errorCount += this.addErrors.length;
            }
            return this.errorCount;
        });
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