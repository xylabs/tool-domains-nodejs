import { DomainConfig } from "./domain"
import { Base } from "./base"

export class RecordConfig extends Base {

  public type: string
  public enabled?: boolean
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

  constructor(type: string) {
    super()
    this.type = type
  }

  public isEnabled() {
    if (this.enabled !== undefined) {
      return this.enabled
    }
    return true
  }
}
