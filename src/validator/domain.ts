import { RecordValidatorA } from './record/a'
import { RecordValidatorCname } from './record/cname'
import { RecordValidator } from './record/base'
import { BaseValidator } from './base'
import { DNS } from '../dns'
import { AnyRecord } from 'dns'
import chalk from 'chalk'
import { Config } from '../config'
import { RecordValidatorMx } from './record/mx'
import { RecordValidatorTxt } from './record/txt'

export class DomainValidator extends BaseValidator {
  public records: RecordValidator[] = []

  public async validate(config: Config): Promise<number> {
    let errorCount = 0
    try {
      if (config.isRecordEnabled(this.name, "A")) {
        this.records = this.records.concat(await this.validateA())
      }
      if (config.isRecordEnabled(this.name, "CNAME")) {
        this.records = this.records.concat(await this.validateCname())
      }
      if (config.isRecordEnabled(this.name, "MX")) {
        this.records = this.records.concat(await this.validateMx())
      }
      if (config.isRecordEnabled(this.name, "TXT")) {
        this.records = this.records.concat(await this.validateTxt())
      }
      for (const record of this.records) {
        await record.validate(config.getRecordTimeout(this.name, record.type))
        if (record.errors) {
          errorCount += record.errors.length
        }
      }
      this.validateDomainRules()
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

  private getRecordTypeCount(type: string) {
    let count = 0
    for (const record of this.records) {
      if (record.type === type) {
        count++
      }
    }
    return count
  }

  private validateDomainRules() {
    // we do not allow both A and CNAME records
    if (this.getRecordTypeCount("A") > 0 && this.getRecordTypeCount("CNAME") > 0) {
      this.addError("domain", `Conflict: Has both A and CNAME records [${this.name}]`)
    }
  }

  private async validateA() {
    const validators: RecordValidatorA[] = []
    try {
      const records = await DNS.resolve4(this.name)
      for (const record of records) {
        const validator = new RecordValidatorA(this.name, record)
        validators.push(validator)
      }
    } catch (ex) {
      this.addError("domain:validateA", ex)
    }
    return validators
  }

  private async validateCname() {
    const validators: RecordValidatorCname[] = []
    try {
      const records = await DNS.resolveCname(this.name)
      for (const record of records) {
        const validator = new RecordValidatorCname(this.name, record)
        validators.push(validator)
      }
    } catch (ex) {
      this.addError("domain:validateCname", ex)
    }
    return validators
  }

  private async validateMx() {
    const validators: RecordValidatorMx[] = []
    try {
      const records = await DNS.resolveMx(this.name)
      for (const record of records) {
        const validator = new RecordValidatorMx(this.name, record)
        validators.push(validator)
      }
    } catch (ex) {
      this.addError("domain:validateMx", ex)
    }
    return validators
  }

  private async validateTxt() {
    const validators: RecordValidatorTxt[] = []
    try {
      const records = await DNS.resolveTxt(this.name)
      for (const record of records) {
        const validator = new RecordValidatorTxt(this.name, record)
        validators.push(validator)
      }
    } catch (ex) {
      this.addError("domain:validateTxt", ex)
    }
    return validators
  }

}
