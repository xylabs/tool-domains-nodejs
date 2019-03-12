import { Record } from './record'
import { oc } from 'ts-optchain'

export class Records {
  public default?: Record
  public a?: Record
  public aaaa?: Record
  public cname?: Record
  public mx?: Record
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
