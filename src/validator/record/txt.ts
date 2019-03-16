import { RecordValidator } from './base'
import { Config } from '../../config'
import { DNS } from '../../dns'
import { RecordValidatorSpf } from './spf'
import chalk from 'chalk'
import { RecordValidatorDmarc } from './dmarc'

export class RecordValidatorTxt extends RecordValidator {

  public value: string[]
  public spf = false
  public googleVerification?: string
  public facebookVerification?: string

  constructor(config: {name: string, value: string[]}) {
    super({ name: config.name, type: "TXT" })
    this.value = config.value
  }

  public async validate(config: {timeout: number}) {
    try {
      const spaceSplit = this.value[0].split(" ")
      if (spaceSplit.length > 1) {
        switch (spaceSplit[0]) {
          case "v=DMARC1;": {
            const validateDmarc = new RecordValidatorDmarc({name: this.name, value: this.value, expected: [
              "p=none;",
              "adkim=r;",
              "aspf=r;",
              "pct=100;",
              "sp=none;"
            ]})
            await validateDmarc.validate(config)
            this.addErrors(validateDmarc.errors)
            break
          }
          case "k=rsa;": {
            const validateDmarc = new RecordValidatorDmarc({name: this.name, value: this.value, expected: [
              "t=s;"
            ]})
            await validateDmarc.validate(config)
            this.addErrors(validateDmarc.errors)
            break
          }
          case "v=spf1": {
            const validateSpf = new RecordValidatorSpf({name: this.name, value: this.value, expected: [
              "include:mail.zendesk.com",
              "include:_spf.google.com"
            ]})
            await validateSpf.validate(config)
            this.addErrors(validateSpf.errors)
            break
          }
          default: {
            this.addError("validate", `Unexpected space TXT record [${this.name}]: ${this.value}`)
            break
          }
        }
      } else {
        const equalSplit = this.value[0].split('=')
        if (equalSplit.length > 1) {
          switch (equalSplit[0]) {
            case "google-site-verification": {
              this.googleVerification = equalSplit[1]
              break
            }
            case "facebook-domain-verification": {
              this.facebookVerification = equalSplit[1]
              break
            }
            default: {
              this.addError("validate", `Unexpected equals TXT record [${this.name}]: ${this.value}`)
              break
            }
          }
        } else {
          this.addError("validate", `Unexpected TXT record [${this.name}]: ${this.value}`)
        }
      }
    } catch (ex) {
      this.addError("RecordValidatorTxt.validate", `Unexpected Error[${this.name}]: ${ex}`)
    }
    return super.validate(config)
  }
}
