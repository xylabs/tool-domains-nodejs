import { Validator } from './validator'
import { Dns } from '../dns'
import http, { IncomingMessage } from 'http'
import https, { Agent } from 'https'
import chalk from 'chalk'
import { RecordConfig } from '../config/record'
import assert from 'assert'
import htmlValidator from 'html-validator'
import axios from 'axios'
import { inspect } from 'util'

export class RecordValidator extends Validator<RecordConfig> {

  public type: string
  public domain?: string
  public records: any[] = []
  public http?: any[]
  public https?: any[]
  public reverseDns?: any
  public values?: any

  constructor(config: RecordConfig) {
    super(config)
    this.type = config.type
    this.domain = config.domain
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
        for (const record of this.records.values()) {
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
        for (const record of this.records.values()) {
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

  protected async get(prefix: string, ip: string) {
    const timeout = this.config.timeout || 1000
    let response: any
    try {
      response = await axios.get(`${prefix}${ip}`,
        {
          responseType: 'text',
          maxRedirects: 0,
          validateStatus: (status: any) => true,
          transformResponse: (data: any) => data,
          timeout, headers: {
            Host: this.config.domain
          }
        }
      )
    } catch (ex) {
      this.addError("get", `Failed [${prefix}${ip}]:${ex.code}`)
      response = {
        code: ex.code,
        message: ex.message
      }
    }
    return response
  }

  protected async checkHttp(value: any) {
    const timeout = this.config.timeout || 1000
    const result: any = {
      ip: value
    }
    try {
      this.http = this.http || []
      assert(value !== undefined)
      let callTime = Date.now()
      const response: any = await this.get("http://", value)
      callTime = Date.now() - callTime
      if (response.status) {
        result.headers = response.headers
        result.statusCode = response.status
        result.statusMessage = response.statusText
        if (this.config.http.callTimeMax) {
          if (result.callTime > this.config.http.callTimeMax) {
            this.addError(
              "https", `Call too slow [${value}]: ${result.callTime}ms [Expected < ${this.config.http.callTimeMax}ms]`)
          }
        }
        if (result.headers) {
          await this.validateHeaders(this.config.http.headers, result.headers)
        }
        result.ip = value
        this.http.push(result)
        const expectedCode = this.config.http.statusCode || 200
        if (result.statusCode !== expectedCode) {
          this.addError("http", `Unexpected Response Code [${value}]: ${result.statusCode} [Expected: ${expectedCode}]`)
        } else {
          if (this.config.html || this.config.html === undefined) {
            if (result.statusCode === 200) {
              await this.validateHtml(response.data, value)
            }
          }
        }
        // we do not want to add the data to the result
        result.data = undefined
      } else {
        this.addError("http", `Failed to get Response [${value}]: ${response.code}: ${response.message}`)
      }
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
      this.https = this.https || []
      assert(value !== undefined)
      let callTime = Date.now()
      const response = await this.get("https://", value)
      callTime = Date.now() - callTime
      if (response.status) {
        result.headers = response.headers
        result.statusCode = response.status
        result.statusMessage = response.statusText
        if (this.config.https.callTimeMax) {
          if (callTime > this.config.https.callTimeMax) {
            this.addError(
              "https", `Call too slow [${value}]: ${callTime}ms [Expected < ${this.config.https.callTimeMax}ms]`)
          }
        }
        if (result.headers) {
          await this.validateHeaders(this.config.https.headers, result.headers)
        }
        result.ip = value
        this.https.push(result)
        const expectedCode = this.config.https.statusCode || 200
        if (result.statusCode !== expectedCode) {
          this.addError(
            "https", `Unexpected Response Code [${value}]: ${result.statusCode} [Expected: ${expectedCode}]`
            )
        } else {
          if (result.statusCode === 200) {
            if (this.config.html || this.config.html === undefined) {
              await this.validateHtml(response.data, value)
            }
          }
        }
        // we do not want to add the data to the result
        result.data = undefined
      } else {
        this.addError("https", `Failed to get Response [${value}]: ${response.code}: ${response.message}`)
      }
    } catch (ex) {
      this.addError("RecordValidator.checkHttps", ex.message)
      console.error(chalk.red(ex.stack))
    }
    return result
  }

  protected async reverseLookup(value ?: string) {
    const result: any[] = []
    try {
      for (const record of this.records.values()) {
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
      if (this.type && this.domain) {
        return await Dns.resolve(this.domain, this.type)
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

}
