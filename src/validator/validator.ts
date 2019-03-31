import chalk from 'chalk'
import { ValidationError } from './error'
import _ from 'lodash'
import { Config } from '../config/config'

export class Validator<T extends Config> {
  public config: T
  public validations: any[] = []
  public errors?: ValidationError[]
  public errorCount = 0

  constructor(config: T) {
    this.config = config
  }

  public toJSON () {
    return _.omit(this, ["config"])
  }

  public async validate() {
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
