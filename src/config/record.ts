import { Config } from "./config"
import assert from 'assert'
import _ from 'lodash'

export class RecordConfig extends Config {

  public static parse(source: any, domain: string) {
    let srcObj = source
    if (typeof source === "string") {
      srcObj = JSON.parse(source)
    }

    assert(typeof srcObj.type === "string")

    let newObj = new RecordConfig(srcObj.type, domain)
    newObj = _.merge(newObj, srcObj)
    return newObj
  }

  public type: string
  public domain?: string
  public timeout?: number
  public html?: boolean
  public callTimeMax?: number

  public reverseDNS?: {
    "enabled": true,
    "value": string
  }

  public allowed?: number[]
  public values?: any[]
  public http?: any
  public https?: any

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

  public isEnabled() {
    if (this.enabled !== undefined) {
      return this.enabled
    }
    return true
  }
}
