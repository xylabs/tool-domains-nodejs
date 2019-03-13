import { RecordValidator } from './base'
import { Config } from '../../config'

export class RecordValidatorCNAME extends RecordValidator {

  constructor(name: string) {
    super(name, "CNAME")
  }

  public async validate(timeout: number): Promise<number> {
    try {
      this.addresses = await this.lookup()
      this.http = await this.checkHttp(timeout)
      this.https = await this.checkHttps(timeout)
      // this.reverseDns = await this.reverseLookup()
    } catch (ex) {
      this.addError("validate", ex)
    }
    return super.validate(timeout)
  }
}
