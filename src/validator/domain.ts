import { RecordValidatorA } from './record/a'
import { RecordValidatorCNAME } from './record/cname'
import { RecordValidator } from './record/base'
import { BaseValidator } from './base'
import { DNS } from '../dns'
import { AnyRecord } from 'dns'

export class DomainValidator extends BaseValidator {
  public records: RecordValidator[] = []

  public async validate(config: object): Promise<DomainValidator> {
    try {
      const records = await DNS.resolveAny(this.name)
      for (const record of records) {
        const validator = this.createRecord(this.name, record)
        await validator.validate(config)
        this.records.push(validator)
        this.errorCount += validator.errorCount
      }
      if (this.errorCount === 0) {
        console.log(`${this.name}: OK`)
      } else {
        console.error(`${this.name}: ${this.errorCount} Errors`)
      }
    } catch (ex) {
      console.error(ex)
      this.addError(ex)
    }
    return this
  }

  private createRecord(name: string, record: AnyRecord) {
    switch (record.type) {
      case "A":
        return new RecordValidatorA(name, this.config)
      case "CNAME":
        return new RecordValidatorCNAME(name, this.config)
      default:
        return new RecordValidator(name, record.type, this.config)
    }
  }

}
