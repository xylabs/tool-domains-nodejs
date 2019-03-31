import _ from "lodash"
import assert from 'assert'
export class Config {

  public static parse(source: any) {
    if (source) {
      let srcObj = source
      if (typeof source === "string") {
        srcObj = JSON.parse(source)
      }

      let config = new Config(srcObj.key)
      config = _.merge(config, srcObj)
      return config
    }
    return undefined
  }

  public key: string
  public enabled?: boolean

  constructor(key: string) {
    this.key = key
  }

  public isEnabled() {
    if (this.enabled === undefined) {
      return true
    }
    return this.enabled
  }

  // replace this in derived class for more advanced merge
  public merge(config?: any) {
    if (config) {
      return _.merge(this, config)
    }
    return this
  }
}
