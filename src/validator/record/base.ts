import { BaseValidator } from '../base'
import { Config } from '../../config'

export class RecordValidator extends BaseValidator {

  public type: string

  constructor(name: string, type: string, config: Config) {
    super(name, config)
    this.type = type
  }

  public async validate(config: object): Promise<BaseValidator> {
    return this
  }

}
