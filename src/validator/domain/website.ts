import { Config } from '../../config'
import { DomainValidator } from '.'
import { DomainConfig } from '../../config/domain'

export class DomainValidatorWebsite extends DomainValidator {

  constructor(config: Config, name: string) {
    super(config, name, "website")
  }

  public async validate(): Promise<number> {
    const recordConfigA = this.config.getRecordConfig(this.name, "A")
    const recordConfigCname = this.config.getRecordConfig(this.name, "CNAME")
    const recordConfigMx = this.config.getRecordConfig(this.name, "MX")
    const recordConfigTxt = this.config.getRecordConfig(this.name, "TXT")

    if (recordConfigA.isEnabled()) {
      this.records = this.records.concat(
        await this.validateA())
    }
    if (recordConfigCname.isEnabled()) {
      this.records = this.records.concat(
        await this.validateCname())
    }
    if (recordConfigMx.isEnabled()) {
      this.records = this.records.concat(await this.validateMx())
    }
    if (recordConfigTxt.isEnabled()) {
      this.records = this.records.concat(await this.validateTxt())
    }
    return super.validate()
  }

  protected validateDomainRules() {
    return super.validateDomainRules()
  }

}
