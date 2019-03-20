import { RecordValidator } from './base'
import { Config } from '../../config'

export class RecordValidatorSpf extends RecordValidator {

  public value: string[]
  public missing: string[] = []
  public found: string[] = []

  constructor(config: Config, name: string, value: string[]) {
    super(config, name, "TXT(SPF)")
    this.value = value
    const recordConfig = this.getRecordConfig()
    if (recordConfig.expected) {
      for (const exp of recordConfig.expected) {
        if (exp.required) {
          this.missing.push(exp.value)
        }
      }
    }
  }

  public async validate() {
    try {
      for (let i = 1; i < this.value.length; i++) {
        const missing = this.getMissing(this.value[i])
        const found = this.getFound(this.value[i])
        if (missing === -1) { // not missing
          if (found !== -1) { // found
            this.addError("validateSpf", `Duplicate [${this.name}]: ${this.value[i]}`)
          } else { // not found
            this.addError("validateSpf", `Unexpected [${this.name}]: ${this.value[i]}`)
          }
        } else { // missing
          if (found !== -1) { // found
            this.addError("validateSpf", `Double Expectation [${this.name}]: ${this.value[i]}`)
          } else { // not found
            this.found.push(this.value[i]) // add to found
            this.missing.splice(missing, 1) // remove from missing
          }
        }
      }
    } catch (ex) {
      this.addError("RecordValidatorSpf.validate", `Unexpected Error[${this.name}]: ${ex}`)
    }
    return super.validate()
  }

  private getMissing(value: string) {
    for (let i = 0; i < this.missing.length; i++) {
      if (value === this.missing[i]) {
        return i
      }
    }
    return -1
  }

  private getFound(value: string) {
    for (let i = 0; i < this.found.length; i++) {
      if (value === this.found[i]) {
        return i
      }
    }
    return -1
  }
}
