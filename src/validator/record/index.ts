import { BaseValidator } from '../base'
import { Dns } from '../../dns'
import http, { IncomingMessage } from 'http'
import https, { Agent } from 'https'
import chalk from 'chalk'
import { RecordConfig } from '../../config/record'
import assert from 'assert'
import htmlValidator from 'html-validator'
import axios from 'axios'

export class RecordValidator extends BaseValidator {

  public type: string
  public records: any[] = []
  public http?: any[]
  public https?: any[]
  public reverseDns?: any
  public values?: any
  public config: RecordConfig

  constructor(name: string, config: RecordConfig) {
    super(name)
    this.config = config
    this.type = config.type
  }

  public async validate() {
    if (this.type.split('|').length === 1) {
      this.records = await this.resolve()
      if (this.config.http) {
        if (((this.config.http.enabled === undefined) && true) || this.config.http.enabled) {
          this.http = await this.checkAllHttp(this.config.http)
        }
        if (((this.config.https.enabled === undefined) && true) || this.config.https.enabled) {
          this.http = await this.checkAllHttps(this.config.https)
        }
      }
      if (this.config.reverseDNS) {
        if (((this.config.reverseDNS.enabled === undefined) && true) || this.config.reverseDNS.enabled) {
          this.reverseDns = await this.reverseLookup(this.config.reverseDNS.value)
        }
      }
      /*if (this.config.values) {
        this.expected =
        for (const record of this.records) {

        }
      }*/
    }
    return super.validate()
  }

  protected async checkAllHttp(config?: any) {
    const result = []
    if (config) {
      let enabled = true
      if (config.enabled !== undefined) {
        enabled = config.enabled
      }
      if (enabled) {
        for (const record of this.records) {
          result.push(await this.checkHttp(record))
        }
      }
    }
    return result
  }

  protected async checkAllHttps(config?: any) {
    const result = []
    if (config) {
      let enabled = true
      if (config.enabled !== undefined) {
        enabled = config.enabled
      }
      if (enabled) {
        for (const record of this.records) {
          result.push(await this.checkHttps(record))
        }
      }
    }
    return result
  }

  protected async validateHtml(data: string, ip: string) {
    const results = await htmlValidator({
      data,
      format: 'json'
    })
    for (const item of results.messages) {
      if (item.type === "error") {
        this.addError(
          "html",
          `[L:${item.lastLine}, C:${item.lastColumn}, ${ip}]: ${item.message}`)
      }
    }
    return results.messages
  }

  protected async checkHttp(value: any) {
    const timeout = this.config.timeout || 1000
    const result: any = {
      ip: value
    }
    try {
      console.log(chalk.gray(`checkHttp: ${value}`))
      this.http = this.http || []
      assert(value !== undefined)
      let callTime = Date.now()
      const response = await axios.get(`https://${value}`, { responseType: 'text', timeout, headers: {
        Host: this.name
      }
      })
      callTime = Date.now() - callTime
      result.headers = response.headers
      result.statusCode = response.status
      result.statusMessage = response.statusText
      if (this.config.http.callTimeMax) {
        if (result.callTime > this.config.http.callTimeMax) {
          this.addError("https", `Call too slow: ${result.callTime}ms [Expected < ${this.config.http.callTimeMax}ms]`)
        }
      }
      await this.validateHeaders(this.config.http.headers, result.headers)
      result.ip = value
      this.http.push(result)
      const expectedCode = this.config.http.statusCode || 200
      if (result.statusCode !== expectedCode) {
        this.addError("http", `Unexpected Response Code: ${result.statusCode} [Expected: ${expectedCode}]`)
      } else {
        if (this.config.html || this.config.html === undefined) {
          if (result.statusCode === 200) {
            const results = await this.validateHtml(response.data, value)
          }
        }
      }
      result.data = undefined
      console.log(chalk.gray(`http[${timeout}]: ${value}: ${result.statusCode}`))
    } catch (ex) {
      this.addError("RecordValidator.checkHttp", ex)
      console.error(ex.stack)
    }
    return result
  }

  protected async checkHttps(value: any) {
    const timeout = this.config.timeout || 1000
    const result: any = {
      ip: value
    }
    try {
      console.log(chalk.gray(`checkHttps: ${value}`))
      this.https = this.https || []
      assert(value !== undefined)
      let callTime = Date.now()
      const response = await axios.request({baseURL: `https://${value}`, responseType: 'text', timeout, headers: {
        Host: this.name
      }})
      callTime = Date.now() - callTime
      result.headers = response.headers
      result.statusCode = response.status
      result.statusMessage = response.statusText
      if (this.config.https.callTimeMax) {
        if (callTime > this.config.https.callTimeMax) {
          this.addError("https", `Call too slow: ${callTime}ms [Expected < ${this.config.https.callTimeMax}ms]`)
        }
      }
      await this.validateHeaders(this.config.https.headers, result.headers)
      result.ip = value
      this.https.push(result)
      const expectedCode = this.config.https.statusCode || 200
      if (result.statusCode !== expectedCode) {
        this.addError("https", `Unexpected Response Code: ${result.statusCode} [Expected: ${expectedCode}]`)
      } else {
        if (result.statusCode === 200) {
          if (this.config.html || this.config.html === undefined) {
            await this.validateHtml(response.data, value)
          }
        }
      }
      console.log(chalk.gray(`https[${timeout}]: ${value}: ${result.statusCode}`))
    } catch (ex) {
      this.addError("RecordValidator.checkHttps", ex)
      console.error(ex.stack)
    }
    return result
  }

  protected async reverseLookup(value ?: string) {
    const result: any[] = []
    try {
      for (const record of this.records) {
        const domains = await Dns.reverse(record)
        let valid = true
        if (value) {
          for (const domain of domains) {
            if (!domain.match(value)) {
              valid = false
              this.addError("reverse", `Unexpected Domain: ${domain} [Expected: ${value}]`)
            }
          }
        }
        result.push({
          ip: record,
          domains,
          valid
        })
      }
    } catch (ex) {
      this.addError("RecordValidator.reverseLookup", ex.message)
      console.error(chalk.red(ex.stack))
    }
    return result
  }

  private async resolve() {
    try {
      if (this.type) {
        return await Dns.resolve(this.name, this.type)
      }
      this.addError("RecordValidator.resolve", "Missing Type")
    } catch (ex) {
      this.addError("RecordValidator.resolve", ex.message)
      console.error(chalk.red(ex.stack))
    }
    return []
  }

  private validateHeaders(expected: any[], actual: any) {
    if (Array.isArray(expected)) {
      for (const item of expected) {
        const value = actual[item.name]
        if (item.required && value === undefined) {
          this.addError("headers", `Missing: ${item.name}`)
        } else if (value === undefined) {
          if (item.value === undefined) {
            this.addError("headers", `Invalid Value Configured: ${item.name}`)
          } else {
            if (!item.value.match(actual[item.name])) {
              this.addError("headers", `Invalid Value [${item.name}]: ${actual[item.name]} [Expected: ${item.value}]`)
            }
          }
        }
      }
    }
  }

  private sanitizeResponse(res: any) {
    return {
      httpVersion: res.httpVersion,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.headers
    }
  }

}
