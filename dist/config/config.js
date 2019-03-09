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
const load_json_file_1 = __importDefault(require("load-json-file"));
class Config {
    constructor() {
        this.verbose = true;
        this.aws = undefined;
        this.expected = undefined;
        this.domains = undefined;
    }
    static load(fileName = './dnslint.json') {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    load_json_file_1.default(fileName).then((json) => {
                        const config = new Config();
                        resolve(Object.assign({}, config, (json)));
                    });
                }
                catch (ex) {
                    reject(ex);
                }
            });
        });
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map