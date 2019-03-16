import { RecordsConfig } from "./records"

interface IDomainConfig {
  [key: string]: any
  enabled: boolean
  timeout: number
}

export class DomainConfig implements IDomainConfig {
  public records?: RecordsConfig = undefined
  public enabled = true
  public timeout = 1000

  constructor(domainConfig?: DomainConfig) {
    if (domainConfig) {
      Object.assign(this, domainConfig)
    }
  }

  public isRecordEnabled(record: string): boolean {
    if (!this.enabled) {
      return false
    }
    if (this.records) {
      const recordConfig = this.records[record]
      if (recordConfig) {
        if (recordConfig.enabled === undefined) {
          if (this.records !== undefined && this.records.default !== undefined) {
            if (this.records.default.enabled === undefined) {
              return true
            }
            return this.records.default.enabled
          }
        } else {
          return recordConfig.enabled
        }
      }
    }
    return true
  }

  public getRecordConfigProperty(recordType: string, property: string): any {
    if (this.records) {
      const recordConfig = this.records[recordType] || this.records.default
      if (recordConfig) {
        if (recordConfig[property] !== undefined) {
          return recordConfig[property]
        }
      }
    }
    return (this as IDomainConfig)[property]
  }

  public isReverseDNSEnabled(record: string): boolean {
    if (this.records) {
      const recordConfig = this.records[record]
      if (recordConfig) {
        if (recordConfig.reverseDNS === undefined && recordConfig.reverseDNS.enabled === undefined) {
          if (this.records !== undefined && this.records.default !== undefined) {
            if (
                this.records.default !== undefined &&
                this.records.default.reverseDNS !== undefined
              ) {
              return this.records.default.reverseDNS
            }
          }
        } else if (
          recordConfig.reverseDNS !== undefined
        ) {
          return recordConfig.reverseDNS.enabled
        }
      }
    }
    return false
  }
}
