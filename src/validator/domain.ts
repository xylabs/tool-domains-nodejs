import { RecordValidatorA } from './record/a'
import { RecordValidatorCNAME } from './record/cname'
import { RecordValidator } from './record/base'
import { BaseValidator } from './base'
import { DNS } from '../dns'
import { AnyRecord } from 'dns'
import chalk from 'chalk'

export class DomainValidator extends BaseValidator {
  public records: RecordValidator[] = []

  public async validate(config: object): Promise<number> {
    let errorCount = 0
    try {
      const records = await DNS.resolveAny(this.name)
      for (const record of records) {
        const validator = this.createRecord(this.name, record)
        await validator.validate(config)
        this.records.push(validator)
        if (validator.errors) {
          errorCount += validator.errors.length
        }
      }
      if (errorCount === 0) {
        console.log(chalk.green(`${this.name}: OK`))
      } else {
        console.error(chalk.red(`${this.name}: ${errorCount} Errors`))
      }
    } catch (ex) {
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
