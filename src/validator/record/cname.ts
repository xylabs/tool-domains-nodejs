import { RecordValidator } from './base'
import { Config } from '../../config'
import { DNS } from '../../dns'

export class RecordValidatorCname extends RecordValidator {

  public value: string

  constructor(config: {name: string, value: string, resolve: boolean, timeout: number}) {
    super({ name: config.name, type: "CNAME" })
    this.value = config.value
    config.timeout = config.timeout || 1000
  }

  public async validate(config: { timeout: number }) {
    try {
      const ip = await DNS.lookup(this.value)
      if (ip && this.config.resolve) {
        this.http = await this.checkHttp(ip, this.name, this.config.timeout)
        this.https = await this.checkHttps(ip, this.name, this.config.timeout)
        this.reverseDns = await this.reverseLookup(ip, this.name, this.config.timeout)
      }
    } catch (ex) {
      this.addError("RecordValidatorCname.validate", `[${this.name}]: ${ex}`)
    }
    return super.validate(config)
  }
}
