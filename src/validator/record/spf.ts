import { RecordValidator } from './base'
import { Config } from '../../config'
import { DNS } from '../../dns'
import { RecordValidatorTxt } from './txt'

export class RecordValidatorSpf extends RecordValidator {

  public value: string[]
  public missing: string[]
  public found: string[] = []

  constructor(name: string, value: string[], expected: string[]) {
    super(name, "TXT(SPF)")
    this.value = value
    this.missing = expected
  }

  public async validate(timeout: number) {
    try {
      for (let i = 1; i < this.value.length; i++) {
        const missing = this.getMissing(this.value[i])
        const found = this.getFound(this.value[i])
        if (missing === -1) { // not missing
          if (found !== -1) { // found
            this.addError("validateSpf", `Duplicate SPF [${this.name}]: ${this.value[i]}`)
          } else { // not found
            this.addError("validateSpf", `Unexpected SPF [${this.name}]: ${this.value[i]}`)
          }
        } else { // missing
          if (found !== -1) { // found
            this.addError("validateSpf", `Double Expectation SPF [${this.name}]: ${this.value[i]}`)
          } else { // not found
            this.found.push(this.value[i]) // add to found
            this.missing.splice(missing, 1) // remove from missing
          }
        }
      }
    } catch (ex) {
      this.addError("validate", ex)
    }
    return super.validate(timeout)
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
