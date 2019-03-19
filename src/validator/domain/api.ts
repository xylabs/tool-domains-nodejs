import { Config } from '../../config'
import { DomainValidator } from '.'

export class DomainValidatorApi extends DomainValidator {

  constructor(config: {name: string}) {
    super({ name: config.name, serverType:"api" })
  }

  public async validate(config: Config): Promise<number> {
    const recordConfigA = config.getRecordConfig(this.serverType, this.name, "A")
    const recordConfigCname = config.getRecordConfig(this.serverType, this.name, "CNAME")
    const recordConfigMx = config.getRecordConfig(this.serverType, this.name, "MX")
    const recordConfigTxt = config.getRecordConfig(this.serverType, this.name, "TXT")

    if (recordConfigA.isEnabled()) {
      this.records = this.records.concat(
        await this.validateA(
          { resolve: true, timeout: recordConfigA.getTimeout() }
        ))
    }
    if (recordConfigCname.isEnabled()) {
      this.records = this.records.concat(
        await this.validateCname(
          { resolve: false, timeout: recordConfigCname.getTimeout() }
        ))
    }
    if (recordConfigMx.isEnabled()) {
      this.records = this.records.concat(await this.validateMx())
    }
    if (recordConfigTxt.isEnabled()) {
      this.records = this.records.concat(await this.validateTxt())
    }
    return super.validate(config)
  }

  protected validateDomainRules() {
    return super.validateDomainRules()
  }

}
