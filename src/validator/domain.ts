import { RecordValidator } from './record'
import { BaseValidator } from './base'
import { DNS } from '../dns'

export class DomainValidator extends BaseValidator {
  public records: RecordValidator[] = []

  public async validate(config: object): Promise<RecordValidator> {
    try {
      const records = await DNS.resolveAny(this.name)
      for (const record of records) {
        const validator = RecordValidator.create(this.name, record)
        await validator.validate(config)
        this.records.push(validator)
      }
    } catch (ex) {
      this.addError(ex)
    }
    return this
  }

}
