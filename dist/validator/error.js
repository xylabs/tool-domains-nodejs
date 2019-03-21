"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(action, source) {
        super();
        this.action = action;
        this.source = source;
        if (source.stack) {
            this.stack = source.stack;
        }
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=error.js.map