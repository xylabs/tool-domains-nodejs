"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const load_json_file_1 = __importDefault(require("load-json-file"));
class Config {
    constructor() {
        this.verbose = true;
        this.aws = undefined;
        this.expected = undefined;
        this.domains = undefined;
    }
    static async load(fileName = './dnslint.json') {
        return new Promise((resolve, reject) => {
            try {
                load_json_file_1.default(fileName).then((json) => {
                    const config = new Config();
                    resolve({ ...config, ...(json) });
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map