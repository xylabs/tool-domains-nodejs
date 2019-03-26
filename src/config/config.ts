import _ from "lodash"

export class Config {
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
