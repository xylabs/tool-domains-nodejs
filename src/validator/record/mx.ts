import { RecordValidator } from './base'
import { Config } from '../../config'
import { DNS } from '../../dns'
import { MxRecord } from 'dns'

export class RecordValidatorMx extends RecordValidator {

  public value: MxRecord

  constructor(name: string, value: MxRecord) {
    super(name, "MX")
    this.value = value
  }

  public async validate(timeout: number) {
    try {
      switch (this.value.exchange) {
        case "aspmx.l.google.com": {
          if (this.value.priority !== 1) {
            this.addError("validate", `Incorrect Priority: ${this.value.exchange}=${this.value.priority} [Expected=1]`)
          }
          break
        }
        case "alt1.aspmx.l.google.com": {
          if (this.value.priority !== 5) {
            this.addError("validate", `Incorrect Priority: ${this.value.exchange}=${this.value.priority} [Expected=5]`)
          }
          break
        }
        case "alt2.aspmx.l.google.com": {
          if (this.value.priority !== 5) {
            this.addError("validate", `Incorrect Priority: ${this.value.exchange}=${this.value.priority} [Expected=5]`)
          }
          break
        }
        case "aspmx2.googlemail.com": {
          if (this.value.priority !== 10) {
            this.addError("validate", `Incorrect Priority: ${this.value.exchange}=${this.value.priority} [Expected=10]`)
          }
          break
        }
        case "aspmx3.googlemail.com": {
          if (this.value.priority !== 10) {
            this.addError("validate", `Incorrect Priority: ${this.value.exchange}=${this.value.priority} [Expected=10]`)
          }
          break
        }
        default: {
          this.addError("validate", `Unexpected Exchange: ${this.value.exchange}=${this.value.priority}`)
        }
      }
    } catch (ex) {
      this.addError("validate", ex)
    }
    return super.validate(timeout)
  }
}
