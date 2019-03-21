import { RecordsConfig } from "./records"
import { RecordConfig } from "./record"
import { stringify } from "querystring"
import _ from 'lodash'

export class DomainConfig {
  public name: string
  public records?: RecordsConfig
  public enabled?: boolean
  public timeout?: number
  public serverType?: string

  constructor(name: string, init?: any[]) {
    this.name = name
    if (init) {
      for (const obj of init) {
        _.merge(this, obj)
      }
    }
    this.records = new RecordsConfig().concat(this.records || [])
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
