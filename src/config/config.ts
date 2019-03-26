import _ from "lodash"

export class Config {
  public enabled?: boolean

  // this must be implemented in derived class
  public getKey() {
    throw new Error("Should not reach this getKey!!")
    return ''
  }

  public isEnabled() {
    if (this.enabled === undefined) {
      return true
    }
    return this.enabled
  }

  public merge(config?: any) {
    throw new Error("Should never get here!")
    if (config) {
      return _.merge(this, config)
    }
    return this
  }
}
