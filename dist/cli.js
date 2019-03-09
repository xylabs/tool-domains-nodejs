"use strict";
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
commander_1.default
    .version(getVersion())
    .usage('$0 <cmd> [args]');
commander_1.default
    .command('start')
    .description('Start the Scanner')
    .action(async () => {
    const tool = new _1.XyDomainScan();
    const result = await tool.start();
    console.log("====================================");
    console.log(result);
});
commander_1.default.parse(process.argv);
if (process.argv.length < 3) {
    commander_1.default.help();
}
//# sourceMappingURL=cli.js.map