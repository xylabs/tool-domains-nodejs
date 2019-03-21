import { RecordConfig } from './record'
import _ from 'lodash'

export class RecordsConfig extends Array <RecordConfig> {

  public concat(records: RecordConfig[]): RecordsConfig {
    for (const record of records) {
      const recordsConfig = _.merge(new RecordConfig(record.type), record)
      this.push(recordsConfig)
    }
    return this
  }

  public isEnabled(type: string): boolean {
    const map = this.getMap()
    let value = true
    const obj = map.get(type)

    if (obj && obj.enabled !== undefined) {
      value = obj.enabled
    } else {
      const def = map.get("default")
      if (def && def.enabled !== undefined) {
        value = def.enabled
      }
    }
    return value
  }

  public getConfig(type: string) {
    let result = new RecordConfig(type)
    const map = this.getMap()
    result = _.merge(result, map.get("default"), map.get(type))
    return result
  }

  public getMap() {
    const map = new Map<string, RecordConfig>()
    for (const record of this) {
      map.set(record.type, record)
    }
    return map
  }
}
