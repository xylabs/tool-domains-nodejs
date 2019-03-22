
import { RecordValidator } from '../record'
import { BaseValidator } from '../base'
import chalk from 'chalk'
import { Config } from '../../config'
import _ from 'lodash'
import Crawler from 'crawler'
import url from 'url'
import { inspect } from 'util'

export class DomainValidator extends BaseValidator {
  public records: RecordValidator[] = []
  public serverType: string
  public config: Config
  public pages?: any

  constructor(name: string, config: Config) {
    super(name)
    this.name = name
    this.config = config
    this.serverType = config.getServerType(name)
  }

  public async validate(): Promise<number> {
    const recordConfigs = this.config.getRecordConfigs(this.name)
    try {
      for (const item of recordConfigs) {
        const recordConfig = item[1]
        if (recordConfig.type !== "default") {
          if (recordConfig.isEnabled()) {
            const record = new RecordValidator(this.name, recordConfig)
            this.records.push(record)
            this.errorCount += await record.validate()
          }
        }
      }
    } catch (ex) {
      this.addError("DomainValidator.validate", ex.message)
      console.error(chalk.red(ex.stack)) // since this is unexpected, show the stack
    }
    if (this.errorCount) {
      console.log(chalk.yellow(`Errors: ${this.errorCount}`))
    }
    if (this.serverType === 'website') {
      // this.pages = await this.getDomainUrls()
    }
    return super.validate()
  }

  private getDomainUrls() {
    const foundUrls: any = {}
    const scannedUrls: any = {}
    return new Promise((resolve, reject) => {
      const crawler = new Crawler({
        maxConnections: 10,
        timeout: 500,
        retries: 0,
        callback: (error: any, res: any, done: any) => {
          console.log(res.options.uri)
          scannedUrls[res.options.uri] = true
          if (error) {
            this.addError("getDomainUrls", error)
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
                    const newUrl = url.resolve(host, href)
                    const newParts = url.parse(newUrl)
                    // if it is from the same domain and has not been added yet, add it
                    if (newParts.protocol && newParts.protocol.match("^http")) {
                      if (newParts.host === inParts.host) {
                        if (foundUrls[newUrl] === undefined) {
                          console.log(newUrl)
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
          console.log("arie", `QueueSize: ${crawler.queueSize}:${Object.keys(scannedUrls).length}`)
          if (Object.keys(foundUrls).length === Object.keys(scannedUrls).length) {
            console.log(chalk.gray("getDomainUrls", `Found pages[${this.name}]: ${Object.keys(scannedUrls).length}`))
            resolve(foundUrls)
          }
        }
      })
      const startingUrl = `https://${this.name}/`
      foundUrls[startingUrl] = true
      crawler.queue(startingUrl)
    })
  }

}
