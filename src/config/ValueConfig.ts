import merge from 'lodash/merge'

import { Config } from './config'

export class ValueConfig extends Config {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static parse(source: any) {
    let srcObj = source
    if (typeof source === 'string') {
      srcObj = JSON.parse(source)
    }

    let value = new ValueConfig(srcObj.name || JSON.stringify(srcObj))
    value = merge(value, srcObj)
    return value
  }

  public name: string

  public disposition?: string

  public filter?: string | object | number

  constructor(name: string) {
    super(name)
    this.name = name
  }

  public toString() {
    if (this.name) {
      return this.name
    }
    if (typeof this.filter === 'object') {
      return JSON.stringify(this.filter)
    }
    return this.filter
  }
}
