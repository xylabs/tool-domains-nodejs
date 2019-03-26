import { RecordConfig } from "./record"
import _ from 'lodash'
import { Config } from "./config"
import { Configs } from "./configs"
import chalk from "chalk"
import assert from "assert"

export class DomainConfig extends Config {

  public static parse(source: any, type: string) {
    let srcObj = source
    if (typeof source === "string") {
      srcObj = JSON.parse(source)
    }

    assert(typeof srcObj.name === "string")

    let domain = new DomainConfig(srcObj.name, type)
    domain = _.merge(domain, srcObj)
    domain.records = new Configs<RecordConfig>()
    if (srcObj.records) {
      for (const record of srcObj.records) {
        const newRecordObj = RecordConfig.parse(record, domain.name)
        domain.records.set(newRecordObj.type, newRecordObj)
      }
    }
    return domain
  }

  public name: string
  public serverType: string
  public records = new Configs<RecordConfig>()
  public timeout = 1000
  public crawl?: boolean

  constructor(name: string, type: string) {
    super()
    this.name = name
    this.serverType = type
  }

  public merge(config?: DomainConfig) {
    if (config) {
      const name = this.name
      let newItem = new DomainConfig(name, this.serverType)
      newItem = _.merge(newItem, config)
      newItem.records = this.records.merge(config.records)
      newItem.name = name
      return newItem
    }
    return this
  }

  public getKey() {
    return this.name
  }

  public getTimeout() {
    return this.timeout || 1000
  }

  public isRecordEnabled(type: string): boolean {
    if (!this.enabled) {
      return false
    }
    if (this.records) {
      const recordConfig = this.records.getConfig(type)
      if (recordConfig) {
        return recordConfig.isEnabled()
      }
    }
    return true
  }

  public isReverseDNSEnabled(type: string): boolean {
    if (this.records) {
      const recordConfig = this.records.getConfig(type)
      if (recordConfig) {
        if (recordConfig.reverseDNS !== undefined && recordConfig.reverseDNS.enabled !== undefined) {
          return recordConfig.reverseDNS.enabled
        }
      }
    }
    return false
  }
}
