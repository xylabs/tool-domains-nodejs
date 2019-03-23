import { RecordsConfig } from "./records"
import _ from 'lodash'
import { Base } from "./base"

export class ServerConfig extends Base {
  public name: string
  public default?: boolean
  public include?: string[]
  public exclude?: string[]
  public records?: RecordsConfig
  public crawl?: boolean

  constructor(name: string, init?: any[]) {
    super()
    this.name = name
    if (init) {
      for (const obj of init) {
        _.merge(this, obj)
      }
    }
    this.records = new RecordsConfig().concat(this.records || [])
  }
}
