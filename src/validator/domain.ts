import { RecordValidatorA } from './record/a'
import { RecordValidator } from './record/base'
import { BaseValidator } from './base'
import { DNS } from '../dns'
import { AnyRecord } from 'dns'

export class DomainValidator extends BaseValidator {
  public records: RecordValidator[] = []

  public async validate(config: object): Promise<RecordValidator> {
    try {
      console.log(`DomainValidator - validate: ${this.name}`)
      const records = await DNS.resolveAny(this.name)
      for (const record of records) {
        console.log(`validate: ${record}`)
        const validator = this.createRecord(this.name, record)
        await validator.validate(config)
        this.records.push(validator)
      }
    } catch (ex) {
      console.error(ex)
      this.addError(ex)
    }
    return this
  }

  private createRecord(name: string, record: AnyRecord) {
    console.log(`RecordValidator - create: ${name}`)
    switch (record.type) {
      case "A":
        return new RecordValidatorA(name)
      default:
        return new RecordValidator(name)
    }
  }

}
