import { RecordValidatorA } from './record/a'
import { RecordValidatorCNAME } from './record/cname'
import { RecordValidator } from './record/base'
import { BaseValidator } from './base'
import { DNS } from '../dns'
import { AnyRecord } from 'dns'
import chalk from 'chalk'
import { Config } from '../config'

export class DomainValidator extends BaseValidator {
  public records: RecordValidator[] = []

  public async validate(config: Config): Promise<number> {
    let errorCount = 0
    try {
      const records = await DNS.resolveAny(this.name)
      for (const record of records) {
        if (config.isRecordEnabled(this.name, record.type)) {
          const validator = this.createRecord(this.name, record)
          await validator.validate(config.getRecordTimeout(this.name, record.type))
          this.records.push(validator)
          if (validator.errors) {
            errorCount += validator.errors.length
          }
        } else {
          console.log(chalk.gray(`Record Disabled: ${record.type}`))
        }
      }
      if (errorCount === 0) {
        console.log(chalk.green(`${this.name}: OK`))
      } else {
        console.error(chalk.red(`${this.name}: ${errorCount} Errors`))
      }
    } catch (ex) {
      console.error(chalk.red(ex.message))
      this.addError("domain", ex)
    }
    return errorCount
  }

  private createRecord(name: string, record: AnyRecord) {
    switch (record.type) {
      case "A":
        return new RecordValidatorA(name)
      case "CNAME":
        return new RecordValidatorCNAME(name)
      default:
        return new RecordValidator(name, record.type)
    }
  }

}
