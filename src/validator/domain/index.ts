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
    try {
      for (const record of this.records) {
        await record.validate({ timeout: config.getRecordTimeout(this.name, record.type) })
        if (record.errors) {
          errorCount += record.errors.length
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
    return (await DNS.resolve(this.name, type)).length
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

  protected async verifyRecordCounts(records: any) {
    let errorCount = 0
    for (const key of Object.keys(records)) {
      const count = await this.getRecordTypeCount(key)
      if (records[key] !== count) {
        this.addError('verifyRecordCounts', `Invalid Record Count: ${key} = ${count} [Expected: ${records[key]}]`)
        errorCount++
      }
    }
    return errorCount
  }

}
