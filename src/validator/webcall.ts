import { Validator } from './validator'
import { WebcallConfig } from '../config/webcall'
import axios from 'axios'
import htmlValidator from 'html-validator'
import chalk from 'chalk'
import { ValueValidator } from './value'

export class WebcallValidator extends Validator<WebcallConfig> {

  public protocol: string
  public address: string
  public host: string
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
      let callTime = Date.now()
      const response: any = await this.get(this.config.protocol, this.address)
      callTime = Date.now() - callTime
      if (response.status) {
        this.headers = response.headers
        this.statusCode = response.status
        this.statusMessage = response.statusText
        if (this.config.callTimeMax && this.callTime) {
          if (this.callTime > this.config.callTimeMax) {
            this.addError(
                'validate',
                `Call too slow: ${this.callTime}ms [Expected < ${this.config.callTimeMax}ms]`
              )
          }
        }

        if (this.headers && this.config.headers) {
          this.validations.concat(await this.validateHeaders(verbose))
        }

        const expectedCode = this.config.statusCode || 200
        if (this.statusCode !== expectedCode) {
          this.addError(
              'validate',
              `Unexpected Response Code: ${this.statusCode} [Expected: ${expectedCode}]`
            )
        } else {
          if (this.config.html) {
            if (this.statusCode === 200) {
              this.validations.concat(await this.validateHtml(response.data))
            }
          }
        }
      } else {
        this.addError('validate', `Failed to get Response: ${response.code}: ${response.message}`)
      }
    } catch (ex) {
      this.addError('validate', ex.message)
      console.error(ex.stack)
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
      format: 'json'
    })
    for (const item of results.messages) {
      if (item.type === 'error') {
        this.addError(
          'validateHtml',
          `[L:${item.lastLine}, C:${item.lastColumn}]: ${item.message}`)
      }
    }
    return results.messages
  }

  private async get(protocol: string, address: string) {
    const timeout = this.config.timeout || 1000
    let response: any
    try {
      response = await axios.get(
        `${protocol}://${this.address}`,
        {
          timeout,
          responseType: 'text',
          maxRedirects: 0,
          validateStatus: (status: any) => true,
          transformResponse: (data: any) => data,
          headers: {
            Host: this.host
          }
        }
      )
    } catch (ex) {
      this.addError('get', `Failed [${protocol}://${this.address}]:${ex.code}`)
      response = {
        code: ex.code,
        message: ex.message
      }
    }
    return response
  }
}
