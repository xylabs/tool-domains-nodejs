import { RecordValidator } from './base'
import { Config } from '../../config'

export class RecordValidatorA extends RecordValidator {

  constructor(name: string) {
    super(name, "A")
  }

  public async validate(config: Config): Promise<number> {
    try {
      this.addresses = await this.lookup()
      this.http = await this.checkHttp(config)
      this.https = await this.checkHttps(config)
      this.reverseDns = await this.reverseLookup()
    } catch (ex) {
      this.addError("validate", ex)
    }
    return super.validate(config)
  }
}
