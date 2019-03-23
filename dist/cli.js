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
const program = commander_1.default;
program
    .version(getVersion())
    .option("-o, --output [value]", "output file path", "dnslint-report.json")
    .option("-d, --domainToCheck [value]", "domain to check")
    .option("-b, --bucket [value]", "s3 bucket to write result to");
program.parse(process.argv);
// start
const tool = new _1.XyDomainScan();
tool.start({ output: program.output, singleDomain: program.domainToCheck, bucket: program.bucket });
//# sourceMappingURL=cli.js.map