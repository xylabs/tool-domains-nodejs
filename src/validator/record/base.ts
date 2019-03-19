import { BaseValidator } from '../base'
import { Config } from '../../config'
import { DNS } from '../../dns'
import http, { IncomingMessage } from 'http'
import https from 'https'
import chalk from 'chalk'
export class RecordValidator extends BaseValidator {

  public type: string
  public records?: any
  public http?: any
  public https?: any
  public reverseDns?: any

  constructor(config: { name: string, type: string }) {
    super(config)
    this.type = config.type
  }

  protected async checkHttp(ip: string, hostname: string, timeout: number) {
    try {
      const result = await this.getHttpResponse(ip, hostname, timeout, false)
      this.validateHttpHeaders(result.headers, ip)
      console.log(chalk.gray(`http[${timeout}]: ${ip}: ${result.statusCode}`))
      return result
    } catch (ex) {
      this.addError("http", ex)
    }
  }

  protected async checkHttps(ip: string, hostname: string, timeout: number) {
    try {
      const result = await this.getHttpResponse(ip, hostname, timeout, true)
      this.validateHttpsHeaders(result.headers, ip)
      console.log(chalk.gray(`https[${timeout}]: ${ip}: ${result.statusCode}`))
      return result
    } catch (ex) {
      this.addError("https", ex)
    }
  }

  protected async reverseLookup(ip: string, hostname: string, timeout: number) {
    // right now we only check for cloudfront
    try {
      const names = await DNS.reverse(ip)
      let found = false
      for (const name of names) {
        if (name.endsWith('.r.cloudfront.net')) {
          found = true
          break
        }
      }
      if (!found) {
        this.addError("reverseLookup", `ReverseDNS Mismatch ${names.join(',')} [Expected: '*.r.cloudfront.net']`)
      }
    } catch (ex) {
      this.addError("reverseLookup", `${ex}`)
    }
  }

  private validateHttpHeaders(headers: any, ip: string) {
    let errorCount = 0
    if (headers.location === undefined) {
      errorCount += this.validateHeader("http", ip, headers, "location", true)
    }
    return errorCount
  }

  // if value is undefined, we assume that it is a wildcard
  private validateHeader(
      action: string,
      ip: string,
      headers: any,
      headerName: string,
      required: boolean,
      value ?: string) {
    if (headers[headerName] === undefined) {
      if (required) {
        this.addError(action, `Missing header [${this.name}/${ip}]: ${headerName}`)
        return 1
      }
    } else {
      if (value) {
        if (headers[headerName] !== value) {
          this.addError(
            action,
            `Incorrect header value [${this.name}/${ip}]: [${headerName}]: ${headers[headerName]} [Expected: ${value}]`)
          return 1
        }
      }
    }
    return 0
  }

  private validateHttpsHeaders(headers: any, ip: string) {
    let errorCount = 0

    errorCount += this.validateHeader("https", ip, headers, "content-type", true)

    errorCount += this.validateHeader("https", ip, headers, "content-security-policy", true, "object-src 'none'")
    errorCount += this.validateHeader("https", ip, headers, "x-content-type-options", true, "nosniff")
    errorCount += this.validateHeader("https", ip, headers, "x-frame-options", true, "DENY")
    errorCount += this.validateHeader("https", ip, headers, "x-xss-protection", true, "1; mode=block")
    errorCount += this.validateHeader("https", ip, headers, "referrer-policy", true, "same-origin")

    return errorCount
  }

  private sanitizeResponse(res: any, callTime: number) {
    return {
      httpVersion: res.httpVersion,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      headers: res.headers,
      callTime
    }
  }

  private async getHttpResponse(ip: string, hostname: string, timeout: number, ssl = false): Promise < any > {
    const prefix = ssl ? "https" : "http"
    const func = ssl ? https : http
    const startTime = Date.now()
    let bytesRead = 0
    let result: any = {}
    return new Promise<any>((resolve, reject) => {
      try {
        const req = func.get(`${prefix}://${ip}`, { hostname, timeout }, (res) => {
          result = this.sanitizeResponse(res, Date.now() - startTime)
          result.port = res.socket.remotePort
          res.on('data', (data) => {
            bytesRead += data.length
          })
        }).on('error', (e) => {
          reject(e.message)
        }).on('close', () => {
          result.bytesRead = bytesRead
          resolve(result)
        }).setTimeout(timeout, () => {
          reject(`Timeout [${this.name}]: ${timeout}`)
        })
      } catch (ex) {
        this.addError("getHttpResponse", `[${this.name}]: ${ex}`)
        reject(ex)
      }
    })
  }

}
