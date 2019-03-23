import { Base } from "./base"

export class AWS extends Base {
  public enabled = true

  public merge(config: any) {
    this.enabled = config.enabled
  }
}
