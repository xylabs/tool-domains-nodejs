import { RecordValidator } from './base'
import { Config } from '../../config'

export class RecordValidatorA extends RecordValidator {

  public value: string

  constructor(config: { name: string, value: string }) {
    super({ name: config.name, type: "A" })
    this.value = config.value
  }

  public async validate(config: { timeout: number }) {
    try {
      this.http = await this.checkHttp(this.value, this.name, config.timeout)
      this.https = await this.checkHttps(this.value, this.name, config.timeout)
      this.reverseDns = await this.reverseLookup(this.value, this.name, config.timeout)
    } catch (ex) {
      this.addError("validate", `Unexpected Error[${this.name}]: ${ex}`)
    }
    return super.validate(config)
  }
}
