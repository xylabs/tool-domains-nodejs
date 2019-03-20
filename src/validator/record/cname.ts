import { RecordValidator } from './base'
import { Config } from '../../config'
import { Dns } from '../../dns'

export class RecordValidatorCname extends RecordValidator {

  public value: string

  constructor(config: Config, name: string, value: string) {
    super(config, name, "CNAME")
    this.value = value
  }

  public async validate(resolve: boolean = true) {
    try {
      const domainConfig = this.config.getDomainConfig(this.name)
      const recordConfig = this.getRecordConfig()
      const timeout = domainConfig.getTimeout()
      const ip = await Dns.lookup(this.value)
      if (ip && resolve) {
        this.http = await this.checkHttp(ip, this.name, timeout)
        this.https = await this.checkHttps(ip, this.name, timeout)
        if (recordConfig.reverseDNS) {
          this.reverseDns = await this.reverseLookup(ip, this.name, timeout)
        }
      }
    } catch (ex) {
      this.addError("RecordValidatorCname.validate", `[${this.name}]: ${ex}`)
    }
    return super.validate()
  }
}
