import chalk from 'chalk'
import { ValidationError } from './error'
import _ from 'lodash'
import isCircular from 'is-circular'

export class BaseValidator {
  public name: string
  public errors?: ValidationError[]
  public errorCount = 0

  constructor(name: string) {
    this.name = name
  }

  public toJSON () {
    return _.omit(this, ["config"])
  }

  public async validate() {
    if (isCircular(this)) {
      this.addError("base", `CIRCULAR: ${this.name}`)
    }

    if (this.errors) {
      this.errorCount += this.addErrors.length
    }

    return this.errorCount
  }

  public addError(action: string, error: any) {
    this.errors = this.errors || []
    this.errors.push(new ValidationError(action, error))
    console.error(chalk.red(`${action}: ${error}`))
    this.errorCount++
  }

  public addErrors(errors: ValidationError[] | undefined) {
    if (errors) {
      this.errors = this.errors || []
      this.errors = this.errors.concat(errors)
      this.errorCount += errors.length
    }
  }

}
