import chalk from 'chalk'
import omit from 'lodash/omit'

import { ValidationError } from './error'

export class Validator<T> {
  public config: T

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public validations: any[] = []

  public errors?: ValidationError[]

  public errorCount = 0

  constructor(config: T) {
    this.config = config
  }

  public toJSON() {
    return omit(this, ['config'])
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public validate(verbose: boolean): Promise<number> | number {
    if (this.errors) {
      this.errorCount += this.addErrors.length
    }

    return this.errorCount
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
