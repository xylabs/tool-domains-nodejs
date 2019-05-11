import { Config } from './config'
import { Configs } from './configs'
import { RecordConfig } from './record'

export class RecordsConfig extends Config {
  public records = new Configs<RecordConfig>()

  public merge(config?: RecordsConfig) {
    if (config) {
      this.records = this.records.merge(config.records)
    }
    return this
  }
}
