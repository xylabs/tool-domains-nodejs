import { Config } from './config'
import assert from 'assert'
import _ from 'lodash'

export class WebcallConfig extends Config {

  public static parse(source: any) {
    let srcObj = source
    if (typeof source === 'string') {
      srcObj = JSON.parse(source)
    }

    assert(typeof srcObj.protocol === 'string')

    let webcall = new WebcallConfig(srcObj.protocol)
    webcall = _.merge(webcall, srcObj)
    return webcall
  }

  public protocol: string
  public port?: number
  public timeout?: number
  public html?: boolean
  public callTimeMax?: number
  public headers?: any[]
  public statusCode?: number

  constructor(protocol: string) {
    super(protocol)
    this.protocol = protocol
  }
}
