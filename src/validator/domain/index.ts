
import { RecordValidator } from '../record'
import { BaseValidator } from '../base'
import chalk from 'chalk'
import { Config } from '../../config'
import _ from 'lodash'

export class DomainValidator extends BaseValidator {
  public records: RecordValidator[] = []
  public serverType: string

  constructor(config: Config, name: string) {
    super(config, name)
    this.name = name
    this.serverType = config.getServerType(name)
  }

  public async validate(): Promise<number> {
    const recordConfigs = this.config.getRecordConfigs(this.name)
    try {
      for (const item of recordConfigs) {
        const recordConfig = item[1]
        if (recordConfig.type !== "default") {
          if (recordConfig.isEnabled()) {
            const record = new RecordValidator(this.name, recordConfig)
            this.records.push(record)
            this.errorCount += await record.validate()
          }
        }
      }
    } catch (ex) {
      this.addError("DomainValidator.validate", ex)
      console.error(chalk.red(ex.stack)) // since this is unexpected, show the stack
    }
    return super.validate()
  }

}
