import { DomainConfig } from "./domain"

export class RecordConfig {

  public name: string
  public enabled?: boolean
  public timeout?: number

  public reverseDNS?: {
    "enabled": true
  }

  public allowed?: number[]

  constructor(name: string) {
    this.name = name
  }

  public getTimeout() {
    return this.timeout || 1000
  }

  public isEnabled() {
    if (this.enabled !== undefined) {
      return this.enabled
    }
    return true
  }
}
