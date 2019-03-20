import { RecordsConfig } from "./records"

export class ServerConfig {
  public name: string
  public default?: boolean
  public include?: string[]
  public exclude?: string[]
  public records?: RecordsConfig

  constructor(name: string, init?: any[]) {
    this.name = name
    if (init) {
      for (const obj of init) {
        _.merge(this, obj)
      }
    }
    this.records = new RecordsConfig().concat(this.records || [])
  }
}
