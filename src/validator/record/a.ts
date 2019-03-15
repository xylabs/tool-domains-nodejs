import { RecordValidator } from './base'
import { Config } from '../../config'

export class RecordValidatorA extends RecordValidator {

  public value: string

  constructor(name: string, value: string) {
    super(name, "A")
    this.value = value
  }

  public async validate(timeout: number) {
    try {
      this.http = await this.checkHttp(this.value, this.name, timeout)
      this.https = await this.checkHttps(this.value, this.name, timeout)
      // this.reverseDns = await this.reverseLookup()
    } catch (ex) {
      this.addError("validate", ex)
    }
    return super.validate(timeout)
  }
}
