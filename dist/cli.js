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
const commander_1 = __importDefault(require("commander"));
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const _1 = require("./");
const getVersion = () => {
    dotenv_expand_1.default({
        parsed: {
            APP_VERSION: '$npm_package_version',
            APP_NAME: '$npm_package_name'
        }
    });
    return process.env.APP_VERSION || 'Unknown';
};
const start = () => __awaiter(this, void 0, void 0, function* () {
    const tool = new _1.XyDomainScan();
    const result = yield tool.start();
    console.log("==== Finished ====");
    return result;
});
commander_1.default
    .version(getVersion());
commander_1.default
    .command('start')
    .description('Start the Scanner (Default)')
    .action(start);
commander_1.default
    .command('config <provider>')
    .description('Configure a part of the system')
    .action((provider) => __awaiter(this, void 0, void 0, function* () {
    console.log(provider);
    return 0;
}));
commander_1.default.parse(process.argv);
// if no args, then default to start
if (commander_1.default.args.length < 1) {
    start();
}
//# sourceMappingURL=cli.js.map