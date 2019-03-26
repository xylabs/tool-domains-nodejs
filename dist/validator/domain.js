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
const record_1 = require("./record");
const validator_1 = require("./validator");
const chalk_1 = __importDefault(require("chalk"));
const crawler_1 = __importDefault(require("crawler"));
const url_1 = __importDefault(require("url"));
const record_2 = require("../config/record");
class DomainValidator extends validator_1.Validator {
    constructor(config, type) {
        super(config);
        this.records = [];
        this.name = config.name;
        this.type = type;
    }
    getKey() {
        return this.config.name;
    }
    validate() {
        const _super = Object.create(null, {
            validate: { get: () => super.validate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.isEnabled()) {
                console.log(chalk_1.default.gray(`Skipping Disabled Domain: ${this.config.name}`));
                return 0;
            }
            try {
                this.records = [];
                if (this.config.records) {
                    for (const recordConfig of this.config.records.values()) {
                        const config = new record_2.RecordConfig(recordConfig.type, this.name).merge(recordConfig);
                        if (config.type !== "default") {
                            if (config.isEnabled()) {
                                const record = new record_1.RecordValidator(config);
                                this.records.push(record);
                                this.errorCount += yield record.validate();
                            }
                        }
                    }
                }
            }
            catch (ex) {
                this.addError("DomainValidator.validate", ex.message);
                console.error(chalk_1.default.red(ex.stack)); // since this is unexpected, show the stack
            }
            if (this.errorCount) {
                console.log(chalk_1.default.yellow(`Errors: ${this.errorCount}`));
            }
            let crawl = false;
            if (this.config.crawl !== undefined) {
                crawl = this.config.crawl;
            }
            return _super.validate.call(this);
        });
    }
    getDomainUrls() {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUrls = {};
            const scannedUrls = {};
            return new Promise((resolve, reject) => {
                const crawler = new crawler_1.default({
                    rateLimit: 100,
                    timeout: 1000,
                    retries: 0,
                    callback: (error, res, done) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            scannedUrls[res.options.uri] = true;
                            if (error) {
                                this.addError("getDomainUrls", error.message);
                            }
                            else {
                                const $ = res.$;
                                if ($) {
                                    $('a').each((i, elem) => {
                                        // get the url from the anchor
                                        if ($(elem).attr('href')) {
                                            const href = $(elem).attr('href').split('#')[0];
                                            const inParts = url_1.default.parse(res.options.uri);
                                            const host = `${inParts.protocol}//${inParts.host}`;
                                            if (host) {
                                                let newUrl = url_1.default.resolve(host, href);
                                                const newParts = url_1.default.parse(newUrl);
                                                newUrl = `${newParts.protocol}//${newParts.hostname}${newParts.pathname}`;
                                                // if it is from the same domain and has not been added yet, add it
                                                if (newParts.protocol && newParts.protocol.match("^http")) {
                                                    if (newParts.host === inParts.host) {
                                                        if (foundUrls[newUrl] === undefined) {
                                                            foundUrls[newUrl] = true;
                                                            crawler.queue(newUrl);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        catch (ex) {
                            this.addError("crawl", `Unexpected Error: ${ex.message}`);
                            console.log(chalk_1.default.red(ex.stack));
                            reject(false);
                        }
                        console.log(chalk_1.default.gray(`crawl [${Object.keys(foundUrls).length}:${Object.keys(scannedUrls).length}]: ${res.options.uri}`));
                        if (Object.keys(foundUrls).length === Object.keys(scannedUrls).length) {
                            console.log(chalk_1.default.gray("getDomainUrls", `Found pages[${this.config.name}]: ${Object.keys(scannedUrls).length}`));
                            resolve(foundUrls);
                        }
                        done();
                    })
                });
                const startingUrl = `https://${this.config.name}/`;
                foundUrls[startingUrl] = true;
                crawler.queue(startingUrl);
            });
        });
    }
}
exports.DomainValidator = DomainValidator;
//# sourceMappingURL=domain.js.map