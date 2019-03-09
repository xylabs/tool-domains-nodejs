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
const aws_1 = require("./aws");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const validator_1 = require("./validator");
const ts_optchain_1 = require("ts-optchain");
class XyDomainScan {
    constructor() {
        this.aws = new aws_1.AWS();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = yield config_1.Config.load();
            const domains = new Map();
            const result = {};
            if (ts_optchain_1.oc(this.config).aws.enabled(true)) {
                yield this.addAWSDomains(domains);
            }
            yield this.addConfigDomains(domains);
            console.log(`Domains Found: ${domains.size}`);
            let completedDomains = 0;
            for (const domain of domains.values()) {
                completedDomains++;
                console.log(`Domain:[${completedDomains}/${domains.keys.length}]: ${domain}`);
                yield domain.validate(this.config);
            }
            console.log(`Saving to File: output.json`);
            this.saveToFile("output.json", result);
        });
    }
    addAWSDomains(domains) {
        return __awaiter(this, void 0, void 0, function* () {
            const awsDomains = yield this.aws.getDomains();
            for (const domain of awsDomains) {
                domains.set(domain, new validator_1.DomainValidator(domain));
            }
            return domains;
        });
    }
    addConfigDomains(domains) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.config && this.config.domains) {
                for (const domain of this.config.domains) {
                    domains.set(domain.name, new validator_1.DomainValidator(domain.name));
                }
            }
            return domains;
        });
    }
    saveToFile(filename, obj) {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.default.open(filename, 'w', (err, fd) => {
                if (err) {
                    console.log(`failed to open file: ${err}`);
                }
                else {
                    fs_1.default.write(fd, JSON.stringify(obj), (errWrite) => {
                        if (errWrite) {
                            console.log(`failed to write file: ${errWrite}`);
                        }
                    });
                }
            });
        });
    }
}
exports.XyDomainScan = XyDomainScan;
//# sourceMappingURL=index.js.map