import assert from 'assert'
import merge from 'lodash/merge'

import { Config } from './config'

export class WebcallConfig extends Config {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parse(source: any) {
    let srcObj = source
    if (typeof source === 'string') {
      srcObj = JSON.parse(source)
    }

    assert(typeof srcObj.protocol === 'string')

    let webcall = new WebcallConfig(srcObj.protocol)
    webcall = merge(webcall, srcObj)
    return webcall
  }

  public protocol: string

  public port?: number

  public timeout?: number

  public html?: boolean

  public callTimeMax?: number

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public headers?: any[]

  public statusCode?: number

  constructor(protocol: string) {
    super(protocol)
    this.protocol = protocol
  }
}
