import { RecordsConfig } from "./records"
import { RecordConfig } from "./record"
import { stringify } from "querystring"

export class DomainConfig {
  public name: string
  public records?: RecordsConfig = undefined
  public enabled = true
  public timeout = 1000

  constructor(name: string) {
    this.name = name
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
