import axios, { AxiosError } from 'axios'
import chalk from 'chalk'
import htmlValidator from 'html-validator'

import { WebcallConfig } from '../config'
import { Validator } from './validator'
import { ValueValidator } from './value'

export class WebcallValidator extends Validator<WebcallConfig> {
  public protocol: string

  public address: string

  public host: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public headers?: any[]

  public statusCode?: number

  public statusMessage?: string

  public callTime?: number

  constructor(config: WebcallConfig, address: string, host: string) {
    super(config)
    this.protocol = this.config.protocol
    this.address = address
    this.host = host
  }

  public async validate(verbose: boolean) {
    try {
      const response = await this.get(this.config.protocol, this.address)
      if (response.status) {
        this.headers = response.headers
        this.statusCode = response.status
        this.statusMessage = response.statusText
        if (this.config.callTimeMax && this.callTime) {
          if (this.callTime > this.config.callTimeMax) {
            this.addError('validate', `Call too slow: ${this.callTime}ms [Expected < ${this.config.callTimeMax}ms]`)
          }
        }

        if (this.headers && this.config.headers) {
          this.validations.concat(await this.validateHeaders(verbose))
        }

        const expectedCode = this.config.statusCode || 200
        if (this.statusCode !== expectedCode) {
          this.addError('validate', `Unexpected Response Code: ${this.statusCode} [Expected: ${expectedCode}]`)
        } else if (this.config.html) {
          if (this.statusCode === 200) {
            this.validations.concat(await this.validateHtml(response.data))
          }
        }
      } else {
        this.addError('validate', `Failed to get Response: ${response.code}: ${response.message}`)
      }
    } catch (ex) {
      const error = ex as Error
      this.addError('validate', error.message)
      console.error(error.stack)
    }
    if (this.errorCount === 0) {
      console.log(chalk.gray(`Webcall Check Passed: ${this.address} [${this.host}]`))
    }
    return super.validate(verbose)
  }

  protected async validateHeaders(verbose: boolean) {
    const result: ValueValidator[] = []
    let errorCount = 0
    if (this.config.headers && this.headers) {
      for (const value of this.config.headers.values()) {
        const dataArray: string[] = []
        const data = this.headers[value.name]
        if (data) {
          dataArray.push(data)
        }
        const validator = new ValueValidator(value, dataArray)
        result.push(validator)
        await validator.validate(verbose)
        errorCount += validator.errorCount
      }
    }
    if (errorCount === 0) {
      console.log(chalk.green('validateHeaders', 'Passed'))
    } else {
      console.log(chalk.red('validateHeaders', `Errors: ${errorCount}`))
    }
    return result
  }

  private async validateHtml(data: string) {
    const results = await htmlValidator({
      data,
      format: 'json',
    })
    for (const item of results.messages) {
      if (item.type === 'error') {
        this.addError('validateHtml', `[L:${item.lastLine}, C:${item.lastColumn}]: ${item.message}`)
      }
    }
    return results.messages
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async get(protocol: string, address: string) {
    const timeout = this.config.timeout || 1000
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any
    try {
      response = await axios.get(`${protocol}://${this.address}`, {
        headers: {
          Host: this.host,
        },
        maxRedirects: 0,
        responseType: 'text',
        timeout,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (data: any) => data,

        // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
        validateStatus: (status: any) => true,
      })
    } catch (ex) {
      const error = ex as AxiosError
      this.addError('get', `Failed [${protocol}://${this.address}]:${error.code}`)
      response = {
        code: error.code,
        message: error.message,
      }
    }
    return response
  }
}
