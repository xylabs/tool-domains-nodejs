import { Config } from '../../config'
import { DomainValidator } from '.'

export class DomainValidatorWebsite extends DomainValidator {

  constructor(config: {name: string}) {
    super({ name: config.name, serverType: "website" })
  }

  public async validate(config: Config): Promise<number> {

    await this.verifyRecordCounts({
      A: 4,
      CNAME: 0,
      TXT: 2
    })

    if (config.isRecordEnabled(this.name, "A")) {
      this.records = this.records.concat(
        await this.validateA(
        { resolve: true, timeout: config.getRecordTimeout(this.name, "A") }
      ))
    }
    if (config.isRecordEnabled(this.name, "CNAME")) {
      this.records = this.records.concat(
        await this.validateCname(
          { resolve: true, timeout: config.getRecordTimeout(this.name, "CNAME") }
        ))
    }
    if (config.isRecordEnabled(this.name, "MX")) {
      this.records = this.records.concat(await this.validateMx())
    }
    if (config.isRecordEnabled(this.name, "TXT")) {
      this.records = this.records.concat(await this.validateTxt())
    }
    return super.validate(config)
  }

  protected validateDomainRules() {
    return super.validateDomainRules()
  }

}
