import { Config } from "./config"
import assert from 'assert'
import _ from 'lodash'

export class ValueConfig extends Config {

  public static parse(source: any) {
    let srcObj = source
    if (typeof source === "string") {
      srcObj = JSON.parse(source)
    }

    let value = new ValueConfig(srcObj.name || JSON.stringify(srcObj))
    value = _.merge(value, srcObj)
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
    if (typeof this.filter === "object") {
      return JSON.stringify(this.filter)
    }
    return this.filter
  }
}
