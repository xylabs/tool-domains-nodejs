import { RecordValidator } from './base'
import { Config } from '../../config'
import { DNS } from '../../dns'

export class RecordValidatorCname extends RecordValidator {

  public value: string

  constructor(name: string, value: string) {
    super(name, "CNAME")
    this.value = value
  }

  public async validate(timeout: number) {
    try {
      const ip = await DNS.lookup(this.value)
      if (ip) {
        this.http = await this.checkHttp(ip, this.name, timeout)
        this.https = await this.checkHttps(ip, this.name, timeout)
        this.reverseDns = await this.reverseLookup(ip, this.name, timeout)
      }
    } catch (ex) {
      this.addError("RecordValidatorCname.validate", `[${this.name}]: ${ex}`)
    }
    return super.validate(timeout)
  }
}
