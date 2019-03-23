import { RecordsConfig } from "./records"
import { RecordConfig } from "./record"
import { stringify } from "querystring"
import _ from 'lodash'
import { Base } from "./base"

export class DomainConfig extends Base {
  public name: string
  public records = new RecordsConfig()
  public enabled = true
  public timeout = 1000
  public serverType = "unknown"
  public crawl = false

  constructor(name: string) {
    super()
    this.name = name
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
        if (recordConfig.enabled !== undefined) {
          return recordConfig.enabled
        }
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
