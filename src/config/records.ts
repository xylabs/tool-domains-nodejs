import { RecordConfig } from './record'

export class RecordsConfig {
  public default?: RecordConfig
  public a?: RecordConfig
  public aaaa?: RecordConfig
  public cname?: RecordConfig
  public mx?: RecordConfig
  [key: string]: any

  public isEnabled(type: string): boolean {
    let value = true
    const obj = this[type]
    if (obj && obj.enabled !== undefined) {
      value = obj.enabled
    } else if (this.default && this.default.enabled !== undefined) {
      value = this.default.enabled
    }
    return value
  }
}
