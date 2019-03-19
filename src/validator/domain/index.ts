import { RecordValidatorA } from '../record/a'
import { RecordValidatorCname } from '../record/cname'
import { RecordValidator } from '../record/base'
import { BaseValidator } from '../base'
import { DNS } from '../../dns'
import chalk from 'chalk'
import { Config } from '../../config'
import { RecordValidatorMx } from '../record/mx'
import { RecordValidatorTxt } from '../record/txt'
import _ from 'lodash'

export class DomainValidator extends BaseValidator {
  public records: RecordValidator[] = []
  public serverType: string

  constructor(config: {name: string, serverType: string}) {
    super({ name: config.name })
    this.serverType = config.serverType
  }

  public async validate(config: Config): Promise<number> {
    let errorCount = 0
    const recordConfigA = config.getRecordConfig(this.serverType, this.name, "A")
    const recordConfigMx = config.getRecordConfig(this.serverType, this.name, "MX")
    const recordConfigTxt = config.getRecordConfig(this.serverType, this.name, "TXT")
    try {
      if (recordConfigA.isEnabled()) {
        const record = await this.validateA(
          { resolve: true, timeout: recordConfigA.getTimeout() }
        )
        this.records = this.records.concat(record)
        for (const item of record) {
          errorCount += await item.validate({ timeout: recordConfigA.getTimeout() })
        }
      }
      const recordConfigCname = config.getRecordConfig(this.serverType, this.name, "CNAME")
      if (recordConfigCname.isEnabled()) {
        const record = await this.validateCname(
          { resolve: true, timeout: recordConfigCname.getTimeout() }
        )
        this.records = this.records.concat(record)
        for (const item of record) {
          errorCount += await item.validate({ timeout: recordConfigCname.getTimeout() })
        }
      }
      if (recordConfigMx.isEnabled()) {
        const record = await this.validateMx()
        this.records = this.records.concat(record)
        for (const item of record) {
          errorCount += await item.validate({ timeout: recordConfigMx.getTimeout() })
        }
      }
      if (recordConfigTxt.isEnabled()) {
        const record = await this.validateTxt()
        this.records = this.records.concat(record)
        for (const item of record) {
          errorCount += await item.validate({ timeout: recordConfigTxt.getTimeout() })
        }
      }
      await this.validateDomainRules()
      if (this.errors) {
        errorCount += this.errors.length
      }
      if (errorCount === 0) {
        console.log(chalk.green(`${this.name}: OK`))
      } else {
        this.addError("validate", `Errors Detected[${this.name}]: ${errorCount}`)
        console.error(chalk.red(`${this.name}: ${errorCount} Errors`))
      }
    } catch (ex) {
      this.addError("domain", ex)
    }
    if (this.errors) {
      return this.errors.length + errorCount
    }
    return super.validate(config)
  }

  protected async getRecordTypeCount(type: string) {
    const subTypes = type.split('|')
    let count = 0
    for (const subType of subTypes) {
      count += (await DNS.resolve(this.name, type)).length
    }
    return count
  }

  protected async validateDomainRules() {
    // we do not allow both A and CNAME records
    if (await this.getRecordTypeCount("A") > 0 && await this.getRecordTypeCount("CNAME") > 0) {
      this.addError("domain", `Conflict: Has both A and CNAME records [${this.name}]`)
    }
  }

  protected async validateA(config: {resolve: boolean, timeout: number}) {
    const validators: RecordValidatorA[] = []
    try {
      const records = await DNS.resolve4(this.name)
      for (const record of records) {
        const validator = new RecordValidatorA(_.merge({ name: this.name, value: record }, this.config))
        validators.push(validator)
      }
    } catch (ex) {
      this.addError("domain:validateA", ex)
    }
    return validators
  }

  protected async validateCname(config: {resolve: boolean, timeout: number}) {
    const validators: RecordValidatorCname[] = []
    try {
      const records = await DNS.resolveCname(this.name)
      for (const record of records) {
        const validator = new RecordValidatorCname(_.merge({ name: this.name, value: record }, this.config))
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
      const records = await DNS.resolveMx(this.name)
      for (const record of records) {
        const validator = new RecordValidatorMx({ name: this.name, value: record })
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
      const records = await DNS.resolveTxt(this.name)
      for (const record of records) {
        const validator = new RecordValidatorTxt({ name: this.name, value: record })
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
