
import { RecordValidator } from './record'
import { Validator } from './validator'
import chalk from 'chalk'
import { MasterConfig } from '../config'
import _ from 'lodash'
import url from 'url'
import { inspect } from 'util'
import { DomainConfig } from '../config/domain'
import { RecordConfig } from '../config/record'

export class DomainValidator extends Validator<DomainConfig> {
  public name: string
  public type: string
  public records: RecordValidator[] = []
  public pages?: any

  constructor(config: DomainConfig, type: string) {
    super(config)
    this.name = config.name
    this.type = type
  }

  public async validate() {
    if (!this.config.isEnabled()) {
      console.log(chalk.gray(`Skipping Disabled Domain: ${this.config.name}`))
      return 0
    }
    try {
      this.records = []
      if (this.config.records) {
        for (const recordConfig of this.config.records.values()) {
          if (recordConfig.type !== '*') {
            if (recordConfig.isEnabled()) {
              const record = new RecordValidator(recordConfig, this.name)
              this.records.push(record)
              this.errorCount += await record.validate()
            }
          }
        }
      }
    } catch (ex) {
      this.addError('DomainValidator.validate', ex.message)
      console.error(chalk.red(ex.stack)) // since this is unexpected, show the stack
    }
    if (this.errorCount) {
      console.log(chalk.yellow(`Errors: ${this.errorCount}`))
    }

    let crawl = false
    if (this.config.crawl !== undefined) {
      crawl = this.config.crawl
    }
    return super.validate()
  }

  /*private async getDomainUrls() {
    const foundUrls: any = {}
    const scannedUrls: any = {}
    return new Promise((resolve, reject) => {
      const crawler = new Crawler({
        rateLimit: 100,
        timeout: 1000,
        retries: 0,
        callback: async(error: any, res: any, done: any) => {
          try {
            scannedUrls[res.options.uri] = true
            if (error) {
              this.addError("getDomainUrls", error.message)
            } else {
              const $ = res.$
              if ($) {
                $('a').each((i: any, elem: any) => {
                  // get the url from the anchor
                  if ($(elem).attr('href')) {
                    const href = $(elem).attr('href').split('#')[0]
                    const inParts = url.parse(res.options.uri)
                    const host = `${inParts.protocol}//${inParts.host}`
                    if (host) {
                      let newUrl = url.resolve(host, href)
                      const newParts = url.parse(newUrl)
                      newUrl = `${newParts.protocol}//${newParts.hostname}${newParts.pathname}`
                      // if it is from the same domain and has not been added yet, add it
                      if (newParts.protocol && newParts.protocol.match("^http")) {
                        if (newParts.host === inParts.host) {
                          if (foundUrls[newUrl] === undefined) {
                            foundUrls[newUrl] = true
                            crawler.queue(newUrl)
                          }
                        }
                      }
                    }
                  }
                })
              }
            }
          } catch (ex) {
            this.addError("crawl", `Unexpected Error: ${ex.message}`)
            console.log(chalk.red(ex.stack))
            reject(false)
          }
          console.log(chalk.gray(
            `crawl [${Object.keys(foundUrls).length}:${Object.keys(scannedUrls).length}]: ${res.options.uri}`))
          if (Object.keys(foundUrls).length === Object.keys(scannedUrls).length) {
            console.log(chalk.gray(
              "getDomainUrls", `Found pages[${this.config.name}]: ${Object.keys(scannedUrls).length}`
            ))
            resolve(foundUrls)
          }
          done()
        }
      })
      const startingUrl = `https://${this.config.name}/`
      foundUrls[startingUrl] = true
      crawler.queue(startingUrl)
    })
  }*/

}
