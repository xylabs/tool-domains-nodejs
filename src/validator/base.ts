import chalk from 'chalk'
import { ValidationError } from './error'
import _ from 'lodash'

export class BaseValidator {
  public name: string
  public errors?: ValidationError[]
  public valid?: boolean
  protected config: any

  constructor(config: {name: string}) {
    this.name = config.name
    this.config = config
  }

  public toJSON () {
    return _.omit(this, ["config"])
  }

  public async validate(config: {}) {
    if (this.errors) {
      this.valid = false
      return this.errors.length
    }
    this.valid = true
    return 0
  }

  public addError(action: string, error: any) {
    this.valid = false
    this.errors = this.errors || []
    this.errors.push(new ValidationError(action, error))
    console.error(chalk.red(`${action}: ${error}`))
  }

  public addErrors(errors: ValidationError[] | undefined) {
    if (errors) {
      this.errors = this.errors || []
      this.errors = this.errors.concat(errors)
    }
  }

}
