import assert from 'assert'
import merge from 'lodash/merge'

import { Config } from './config'
import { Configs } from './configs'
import { ValueConfig } from './ValueConfig'
import { WebcallConfig } from './WebcallConfig'

export class RecordConfig extends Config {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parse(source: any, domain?: string) {
    let srcObj = source
    if (typeof source === 'string') {
      srcObj = JSON.parse(source)
    }

    assert(typeof srcObj.type === 'string')
    assert(domain)

    let record = new RecordConfig(srcObj.type, domain)
    record = merge(record, srcObj)
    record.webcalls = new Configs<WebcallConfig>()
    if (srcObj.webcalls) {
      for (const webcall of srcObj.webcalls) {
        const newWebcallObj = WebcallConfig.parse(webcall)
        record.webcalls.set(newWebcallObj.protocol, newWebcallObj)
      }
    }
    record.values = new Configs<ValueConfig>()
    if (srcObj.values) {
      for (const value of srcObj.values) {
        const newValueObj = ValueConfig.parse(value)
        record.values.set(newValueObj.name, newValueObj)
      }
    }

    return record
  }

  public type: string

  public domain?: string

  public timeout?: number

  public callTimeMax?: number

  public inheritable?: boolean

  public reverseDNS?: {
    enabled: true
    value: string
  }

  public values?: Configs<ValueConfig>

  public webcalls?: Configs<WebcallConfig>

  constructor(type: string, domain?: string) {
    super(type)
    this.type = type
    this.domain = domain
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public merge(config?: any) {
    if (config) {
      const { type } = this
      const { domain } = this
      let values = new Configs<ValueConfig>()
      values = values.merge(this.values)
      values = values.merge(config.values)
      let newItem = new RecordConfig(type, domain)
      newItem = merge(newItem, config)
      newItem.values = values
      newItem.type = type
      newItem.domain = domain
      return newItem
    }
    return this
  }
}
