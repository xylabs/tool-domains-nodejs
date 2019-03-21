import { DomainConfig } from "./domain"

export class RecordConfig {

  public type: string
  public enabled?: boolean
  public timeout?: number
  public html?: boolean

  public reverseDNS?: {
    "enabled": true,
    "value": string
  }

  public allowed?: number[]
  public values?: any[]
  public http?: any
  public https?: any

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
