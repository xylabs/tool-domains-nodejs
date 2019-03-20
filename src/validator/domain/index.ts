import { RecordValidatorA } from '../record/a'
import { RecordValidatorCname } from '../record/cname'
import { RecordValidator } from '../record/base'
import { BaseValidator } from '../base'
import chalk from 'chalk'
import { Config } from '../../config'
import { RecordValidatorMx } from '../record/mx'
import { RecordValidatorTxt } from '../record/txt'
import _ from 'lodash'
import { Dns } from '../../dns'

export class DomainValidator extends BaseValidator {
  public records: RecordValidator[] = []
  public serverType: string

  constructor(config: Config, name: string, serverType: string) {
    super(config, name)
    this.name = name
    this.serverType = serverType
  }

  public async validate(): Promise<number> {
    const recordConfigA = this.config.getRecordConfig(this.name, "A")
    const recordConfigMx = this.config.getRecordConfig(this.name, "MX")
    const recordConfigTxt = this.config.getRecordConfig(this.name, "TXT")
    try {
      if (recordConfigA.isEnabled()) {
        const record = await this.validateA()
        this.records = this.records.concat(record)
        for (const item of record) {
          this.errorCount += await item.validate()
        }
      }
      const recordConfigCname = this.config.getRecordConfig(this.name, "CNAME")
      if (recordConfigCname.isEnabled()) {
        const record = await this.validateCname()
        this.records = this.records.concat(record)
        for (const item of record) {
          this.errorCount += await item.validate()
        }
      }
      if (recordConfigMx.isEnabled()) {
        const record = await this.validateMx()
        this.records = this.records.concat(record)
        for (const item of record) {
          this.errorCount += await item.validate()
        }
      }
      if (recordConfigTxt.isEnabled()) {
        const record = await this.validateTxt()
        this.records = this.records.concat(record)
        for (const item of record) {
          this.errorCount += await item.validate()
        }
      }
      await this.validateDomainRules()
      if (this.errors) {
        this.errorCount += this.errors.length
      }
      if (this.errorCount === 0) {
        console.log(chalk.green(`${this.name}: OK`))
      } else {
        console.error(chalk.red(`${this.name}: ${this.errorCount} Errors`))
      }
    } catch (ex) {
      this.addError("domain", ex)
    }
    return super.validate()
  }

  protected async getRecordTypeCount(type: string) {
    const subTypes = type.split('|')
    let count = 0
    for (const subType of subTypes) {
      count += (await Dns.resolve(this.name, type)).length
    }
    return count
  }

  protected async validateDomainRules() {
    // we do not allow both A and CNAME records
    if (await this.getRecordTypeCount("A") > 0 && await this.getRecordTypeCount("CNAME") > 0) {
      this.addError("domain", `Conflict: Has both A and CNAME records [${this.name}]`)
    }
  }

  protected async validateA() {
    const validators: RecordValidatorA[] = []
    try {
      const records = await Dns.resolve4(this.name)
      for (const record of records) {
        const validator = new RecordValidatorA(this.config, this.name, record)
        validators.push(validator)
      }
    } catch (ex) {
      this.addError("domain:validateA", ex)
    }
    return validators
  }

  protected async validateCname() {
    const validators: RecordValidatorCname[] = []
    try {
      const records = await Dns.resolveCname(this.name)
      for (const record of records) {
        const validator = new RecordValidatorCname(this.config, this.name, record)
        validators.push(validator)
      }
    } catch (ex) {
      this.addError("domain:validateCname", ex)
    }
    return validators
  }

  protected async validateMx() {
    const validators: RecordValidatorMx[] = []
    try {
      const records = await Dns.resolveMx(this.name)
      for (const record of records) {
        const validator = new RecordValidatorMx(this.config, this.name, record)
        validators.push(validator)
      }
    } catch (ex) {
      this.addError("domain:validateMx", ex)
    }
    return validators
  }

  protected async validateTxt() {
    const validators: RecordValidatorTxt[] = []
    try {
      const records = await Dns.resolveTxt(this.name)
      for (const record of records) {
        const validator = new RecordValidatorTxt(this.config, this.name, record)
        validators.push(validator)
      }
    } catch (ex) {
      this.addError("domain:validateTxt", ex)
    }
    return validators
  }

  protected async verifyRecordCounts(config: Config) {

    let errorCount = 0

    if (config.servers) {

      const serverConfig = config.servers.getMap().get(this.serverType)
      if (serverConfig) {
        const records = serverConfig.records
        if (records) {
          for (const record of records) {
            if (record.allowed) {
              const count = await this.getRecordTypeCount(record.name)
              let allowed = false

              for (const allow of record.allowed) {
                if (count === allow) {
                  allowed = true
                }
              }

              if (!allowed) {
                this.addError(
                  'verifyRecordCounts',
                  `Invalid Record Count: ${record.name} = ${count} [Expected: ${record.allowed}]`
                  )
                errorCount++
              }
            }
          }
        }
      }
    }
    return errorCount
  }

}
