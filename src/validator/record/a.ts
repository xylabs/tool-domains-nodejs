import { RecordValidator } from './base'
import { Config } from '../../config'
import { RecordConfig } from '../../config/record'

export class RecordValidatorA extends RecordValidator {

  public value: string

  constructor(config: Config, name: string, value: string) {
    super(config, name, "A")
    this.value = value
  }

  public async validate() {
    try {
      const domainConfig = this.config.getDomainConfig(this.name)
      const recordConfig = this.getRecordConfig()
      const timeout = domainConfig.getTimeout()
      this.http = await this.checkHttp(this.value, this.name, timeout)
      this.https = await this.checkHttps(this.value, this.name, timeout)
      if (recordConfig.reverseDNS) {
        this.reverseDns = await this.reverseLookup(this.value, this.name, timeout)
      }
    } catch (ex) {
      this.addError("validate", `Unexpected Error[${this.name}]: ${ex}`)
    }
    return super.validate()
  }
}
