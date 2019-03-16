import chalk from 'chalk'
import { ValidationError } from './error'
import { Config } from '../config'

export class BaseValidator {
  public name: string
  public errors?: ValidationError[]
  public valid?: boolean

  constructor(name: string) {
    this.name = name
  }

  public async validate(arg: any) {
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
