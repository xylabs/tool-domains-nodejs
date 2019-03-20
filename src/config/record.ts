import { DomainConfig } from "./domain"

export class RecordConfig {

  public type: string
  public enabled?: boolean

  public reverseDNS?: {
    "enabled": true
  }

  public allowed?: number[]
  public expected?: any[]

  constructor(type: string) {
    this.type = type
  }

  public isEnabled() {
    if (this.enabled !== undefined) {
      return this.enabled
    }
    return true
  }
}
