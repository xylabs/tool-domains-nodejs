import assert from 'assert'
import merge from 'lodash/merge'

import { Configs } from './configs'
import { RecordConfig } from './record'
import { RecordsConfig } from './records'

export class DomainConfig extends RecordsConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parse(source: any, type?: string) {
    let srcObj = source
    if (typeof source === 'string') {
      srcObj = JSON.parse(source)
    }

    assert(typeof srcObj.name === 'string')
    assert(type)

    let domain = new DomainConfig(srcObj.name, type || 'unknown')
    domain = merge(domain, srcObj)
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

  public timeout = 1000

  public crawl?: boolean

  constructor(name: string, type: string) {
    super(name)
    this.name = name
    this.serverType = type
  }

  public merge(config?: DomainConfig) {
    if (config) {
      const { name } = this
      merge(new DomainConfig(name, this.serverType), config)
      this.name = name
      super.merge(config)
    }
    return this
  }

  public getTimeout() {
    return this.timeout || 1000
  }

  public isRecordEnabled(type: string): boolean {
    if (!this.enabled) {
      return false
    }
    if (this.records) {
      const recordConfig = this.records.getConfig(type, new RecordConfig(type, this.name))
      if (recordConfig) {
        return recordConfig.isEnabled()
      }
    }
    return true
  }

  public isReverseDNSEnabled(type: string): boolean {
    if (this.records) {
      const recordConfig = this.records.getConfig(type, new RecordConfig(type, this.name))
      if (recordConfig) {
        if (recordConfig.reverseDNS !== undefined && recordConfig.reverseDNS.enabled !== undefined) {
          return recordConfig.reverseDNS.enabled
        }
      }
    }
    return false
  }
}
