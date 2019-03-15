import chalk from 'chalk'
import { ValidationError } from './error'

export class BaseValidator {
  public name: string
  public errors?: ValidationError[]

  constructor(name: string) {
    this.name = name
  }

  public addError(action: string, error: any) {
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
