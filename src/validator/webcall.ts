import { Validator } from "./validator"
import { WebcallConfig } from "../config/webcall"
import Axios from "axios"
import htmlValidator from 'html-validator'
import chalk from "chalk"

export class WebcallValidator extends Validator<WebcallConfig> {

  public address: string
  public host: string
  public headers?: any[]
  public statusCode?: number
  public statusMessage?: string
  public callTime?: number

  constructor(config: WebcallConfig, address: string, host: string) {
    super(config)
    this.address = address
    this.host = host
  }

  public async validate() {
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
                "validate",
                `Call too slow: ${this.callTime}ms [Expected < ${this.config.callTimeMax}ms]`
              )
          }
        }

        if (this.headers && this.config.headers) {
          await this.validateHeaders(this.config.headers)
        }

        const expectedCode = this.config.statusCode || 200
        if (this.statusCode !== expectedCode) {
          this.addError(
              "validate",
              `Unexpected Response Code: ${this.statusCode} [Expected: ${expectedCode}]`
            )
        } else {
          if (this.config.html) {
            if (this.statusCode === 200) {
              await this.validateHtml(response.data)
            }
          }
        }
      } else {
        this.addError("validate", `Failed to get Response: ${response.code}: ${response.message}`)
      }
    } catch (ex) {
      this.addError("validate", ex.message)
      console.error(ex.stack)
    }
    return super.validate()
  }

  private validateHeaders(expected: any[]) {
    if (this.headers) {
      if (Array.isArray(expected)) {
        for (const item of expected) {
          const value = this.headers[item.name]
          if (item.required && value === undefined) {
            this.addError("validateHeaders", `Missing: ${item.name}`)
          } else if (value === undefined) {
            if (item.value === undefined) {
              this.addError("validateHeaders", `Invalid Value Configured: ${item.name}`)
            } else {
              if (!item.value.match(this.headers[item.name])) {
                this.addError(
                  "validateHeaders",
                  `Invalid Value [${item.name}]: ${this.headers[item.name]} [Expected: ${item.value}]`
                )
              }
            }
          }
        }
      }
    } else {
      this.addError("validateHeaders", "No headers found")
    }
  }

  private async validateHtml(data: string) {
    const results = await htmlValidator({
      data,
      format: 'json'
    })
    for (const item of results.messages) {
      if (item.type === "error") {
        this.addError(
          "validateHtml",
          `[L:${item.lastLine}, C:${item.lastColumn}]: ${item.message}`)
      }
    }
    return results.messages
  }

  private async get(protocol: string, address: string) {
    console.log(chalk.gray(`get: ${protocol}:${address}:${this.host}`))
    const timeout = this.config.timeout || 1000
    let response: any
    try {
      response = await Axios.get(`${protocol}://${this.address}`,
        {
          responseType: 'text',
          maxRedirects: 0,
          validateStatus: (status: any) => true,
          transformResponse: (data: any) => data,
          timeout, headers: {
            Host: this.host
          }
        }
      )
    } catch (ex) {
      this.addError("get", `Failed [${protocol}://${this.address}]:${ex.code}`)
      response = {
        code: ex.code,
        message: ex.message
      }
    }
    return response
  }
}
