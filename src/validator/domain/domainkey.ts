import { Config } from '../../config'
import { DomainValidator } from '.'

export class DomainValidatorDomainKey extends DomainValidator {

  constructor(config: {name: string}) {
    super({ name: config.name, serverType: "domainkey" })
  }

  public async validate(config: Config): Promise<number> {
    await this.verifyRecordCounts({
      CNAME: 1,
      TXT: 1
    })
    if (config.isRecordEnabled(this.name, "TXT")) {
      this.records = this.records.concat(await this.validateTxt())
    }
    if (config.isRecordEnabled(this.name, "CNAME")) {
      this.records = this.records.concat(
        await this.validateCname(
          { resolve: false, timeout: config.getRecordTimeout(this.name, "CNAME") }
        ))
    }
    return super.validate(config)
  }

  protected validateDomainRules() {
    return super.validateDomainRules()
  }

}
