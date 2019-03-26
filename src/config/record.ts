import { Config } from "./config"
import assert from 'assert'
import _ from 'lodash'
import { WebcallConfig } from "./webcall"
import { Configs } from "./configs"

export class RecordConfig extends Config {

  public static parse(source: any, domain: string) {
    let srcObj = source
    if (typeof source === "string") {
      srcObj = JSON.parse(source)
    }

    assert(typeof srcObj.type === "string")

    let record = new RecordConfig(srcObj.type, domain)
    record = _.merge(record, srcObj)
    record.webcalls = new Configs<WebcallConfig>()
    if (srcObj.webcalls) {
      for (const webcall of srcObj.webcalls) {
        const newWebcallObj = WebcallConfig.parse(webcall)
        record.webcalls.set(newWebcallObj.protocol, newWebcallObj)
      }
    }
    return record
  }

  public type: string
  public domain?: string
  public timeout?: number
  public callTimeMax?: number

  public reverseDNS?: {
    "enabled": true,
    "value": string
  }

  public allowed?: number[]
  public values?: any[]
  public webcalls?: Configs<WebcallConfig>

  constructor(type: string, domain?: string) {
    super(type)
    this.type = type
    this.domain = domain
  }

  public merge(config?: any) {
    if (config) {
      const type = this.type
      const domain = this.domain
      let newItem = new RecordConfig(type, domain)
      newItem = _.merge(newItem, config)
      newItem.type = type
      newItem.domain = domain
      return newItem
    }
    return this
  }
}
