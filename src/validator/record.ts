import { Validator } from './validator'
import { Dns } from '../dns'
import chalk from 'chalk'
import { RecordConfig } from '../config/record'
import { WebcallValidator } from './webcall'

export class RecordValidator extends Validator<RecordConfig> {

  public type: string
  public domain: string
  public records: any[] = []
  public webcalls: WebcallValidator[] = []
  public reverseDns?: any

  constructor(config: RecordConfig, domain: string) {
    super(config)
    this.domain = domain
    this.type = config.type
  }

  public async validate() {
    if (this.type.split('|').length === 1) {
      await this.resolve()
      this.webcalls = await this.validateWebcalls()
      if (this.config.reverseDNS) {
        if (((this.config.reverseDNS.enabled === undefined) && true) || this.config.reverseDNS.enabled) {
          this.reverseDns = await this.reverseLookup(this.config.reverseDNS.value)
        }
      }
    }
    return super.validate()
  }

  protected async validateWebcalls() {
    const result: WebcallValidator[] = []
    if (this.config.webcalls) {
      for (const webcall of this.config.webcalls.values()) {
        for (const record of this.records) {
          const validator = new WebcallValidator(webcall, record, this.domain)
          result.push(validator)
          await validator.validate()
          this.errorCount += validator.errorCount
        }
      }
    }
    return result
  }

  protected async reverseLookup(value ?: string) {
    const result: any[] = []
    try {
      for (const record of this.records) {
        const domains = await Dns.reverse(record) // TODO: Figure out what to send
        let valid = true
        if (value) {
          for (const domain of domains) {
            if (!domain.match(value)) {
              valid = false
              this.addError("reverse", `Unexpected Domain: ${domain} [Expected: ${value}]`)
            }
          }
        }
        result.push({
          ip: record,
          domains,
          valid
        })
      }
    } catch (ex) {
      this.addError("RecordValidator.reverseLookup", ex.message)
      console.error(chalk.red(ex.stack))
    }
    return result
  }

  private async resolve() {
    this.records = []
    try {
      if (!this.type) {
        this.addError("resolve", "Missing Type")
        return
      }
      if (!this.domain) {
        this.addError("resolve", "Missing Domain")
        return
      }
      this.records = await Dns.resolve(this.domain, this.type)
    } catch (ex) {
      this.addError("resolve", ex.message)
      console.error(chalk.red(ex.stack))
    }
  }

}
