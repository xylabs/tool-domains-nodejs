import { RecordConfig } from './record'

export class RecordsConfig extends Array <RecordConfig> {

  public concat(records: RecordConfig[]): RecordsConfig {
    for (const record of records) {
      const recordsConfig = Object.assign(new RecordConfig(record.name), record)
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
    const result = new RecordConfig(type)
    const map = this.getMap()
    Object.assign(result, map.get("default"))
    Object.assign(result, map.get(type))
    return result
  }

  public getMap() {
    const map = new Map<string, RecordConfig>()
    for (const record of this) {
      map.set(record.name, record)
    }
    return map
  }
}
