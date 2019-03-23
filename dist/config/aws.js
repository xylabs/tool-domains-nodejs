"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class AWS extends base_1.Base {
    constructor() {
        super(...arguments);
        this.enabled = true;
    }
    merge(config) {
        this.enabled = config.enabled;
    }
}
exports.AWS = AWS;
//# sourceMappingURL=aws.js.map