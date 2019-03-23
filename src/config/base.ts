import _ from "lodash"

export class Base {
  public merge(config: any) {
    return _.merge(this, config)
  }
}
