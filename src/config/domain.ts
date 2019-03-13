import { RecordsConfig } from "./records"

export class DomainConfig {
  public records?: RecordsConfig = undefined
  public enabled = true
  public timeout = 1000

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

  public getTimeout(record: string): number {
    if (this.records) {
      const recordConfig = this.records[record]
      if (recordConfig) {
        if (recordConfig.timeout === undefined) {
          if (this.records !== undefined && this.records.default !== undefined) {
            if (this.records.default.timeout !== undefined) {
              return this.records.default.timeout
            }
          }
        } else {
          return recordConfig.timeout
        }
      }
    }
    return this.timeout
  }

  public isReverseDNSEnabled(record: string): boolean {
    if (this.records) {
      const recordConfig = this.records[record]
      if (recordConfig) {
        if (recordConfig.reverseDNS === undefined && recordConfig.reverseDNS.enabled === undefined) {
          if (this.records !== undefined && this.records.default !== undefined) {
            if (
                this.records.default !== undefined &&
                this.records.default.reverseDNS !== undefined &&
                this.records.default.reverseDNS.enabled !== undefined
              ) {
              return this.records.default.reverseDNS.enabled
            }
          }
        } else if (
          recordConfig.reverseDNS.enabled !== undefined
        ) {
          return recordConfig.reverseDNS.enabled
        }
      }
    }
    return false
  }
}
