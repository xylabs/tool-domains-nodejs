import 'chalk'

export class BaseValidator {
  public name: string
  public errors?: object[]

  constructor(name: string) {
    this.name = name
  }

  public addError(action: string, error: any) {
    this.errors = this.errors || []
    this.errors.push({ action, error })
  }

}
