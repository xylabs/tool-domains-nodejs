import { Validator } from "./validator"
import { ValueConfig } from "../config/value"
import chalk from "chalk"

export class ValueValidator extends Validator<ValueConfig> {

  public data: string[] | object[] | number[]
  private context: string

  constructor(config: ValueConfig, data: string[] | object[] | number[], context?: string) {
    super(config)
    this.data = data
    this.context = context || "ValueValidator"
  }

  public async validate() {
    if (this.config.filter) {
      switch (this.config.disposition) {
        case 'required':
          return this.validateRequired()
      }
    }
    console.log(chalk.gray(
      `Value Check Passed[${this.context}]: ${this.config.name || this.config.filter}:${this.data}`))
    return super.validate()
  }

  private validateRequired() {
    if (this.config.filter) {
      let matchesFound = 0
      for (const data of this.data) {
        if (this.checkValue(this.config.filter, data)) {
          matchesFound++
        }
      }
      if (matchesFound > 0) {
        console.log(chalk.gray(`Required Value Check Passed [${this.context}]: ${this.config}`))
      } else {
        this.addError(this.context, `Required value missing: ${this.config}:${JSON.stringify(this.data)}`)
      }
    }
    return super.validate()
  }

  private checkValue(filter: any, data: any) {
    let matched = false
    if (typeof filter === typeof data) {
      if (typeof data === "string") {
        if ((data.match(filter as string))) {
          matched = true
        }
      } else if (typeof data === "object") {
        matched = true
        for (const key of Object.keys(filter)) {
          if (!this.checkValue(filter[key], data[key])) {
            matched = false
          }
        }
      } else if (data === filter) {
        matched = true
      }
    } else {
      this.addError(this.context, `Value type mismatch [${ typeof data } should be ${ typeof filter }]`)
      this.addError(
        this.context, `Value type mismatch [${ JSON.stringify(data) } should be ${ JSON.stringify(filter) }]`)
    }
    return matched
  }
}
