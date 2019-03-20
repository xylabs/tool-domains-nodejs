import { DomainConfig } from "./domain"

export class RecordConfig {

  public name: string
  public type?: string
  public enabled?: boolean

  public reverseDNS?: {
    "enabled": true
  }

  public allowed?: number[]
  public expected?: any[]

  constructor(name: string) {
    this.name = name
  }

  public isEnabled() {
    if (this.enabled !== undefined) {
      return this.enabled
    }
    return true
  }
}
