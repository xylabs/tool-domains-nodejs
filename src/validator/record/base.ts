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

  constructor(name: string, type: string) {
    super(name)
    this.type = type
  }

  public async validate(timeout: number) {
    if (this.errors) {
      return this.errors.length
    }
    return 0
  }

  protected async checkHttp(ip: string, hostname: string, timeout: number) {
    try {
      const result = await this.getHttpResponse(ip, hostname, timeout, false)
      this.validateHttpHeaders(result.headers)
      return result
    } catch (ex) {
      this.addError("http", ex)
    }
  }

  protected async checkHttps(ip: string, hostname: string, timeout: number) {
    try {
      const result = await this.getHttpResponse(ip, hostname, timeout, true)
      this.validateHttpsHeaders(result.headers)
      return result
    } catch (ex) {
      this.addError("https", ex)
    }
  }

  protected async reverseLookup() {
    try {
      return await DNS.reverse(this.name)
    } catch (ex) {
      this.addError("reverseLookup", ex)
    }
  }

  private validateHttpHeaders(headers: any) {
    let errorCount = 0
    if (headers.location === undefined) {
      this.addError("http", "Missing location header")
      errorCount++
    }
    return errorCount
  }

  private validateHttpsHeaders(headers: any) {
    let errorCount = 0
    if (headers["content-type"] !== "text/html; charset=utf-8") {
      this.addError("http", "Invalid or missing content-type header")
      errorCount++
    }
    if (headers["content-security-policy"] !== "object-src 'none'") {
      this.addError("http", "Invalid or missing content-security-policy header")
      errorCount++
    }
    if (headers["content-security-policy"] !== "object-src 'none'") {
      this.addError("http", "Invalid or missing content-security-policy header")
      errorCount++
    }
    if (headers["x-content-type-options"] !== "nosniff") {
      this.addError("http", "Invalid or missing x-content-type-options header")
      errorCount++
    }
    if (headers["x-frame-options"] !== "DENY") {
      this.addError("http", "Invalid or missing x-frame-options header")
      errorCount++
    }
    if (headers["x-xss-protection"] !== "1; mode=block") {
      this.addError("http", "Invalid or missing x-xss-protection header")
      errorCount++
    }
    if (headers["referrer-policy"] !== "same-origin") {
      this.addError("http", "Invalid or missing referrer-policy header")
      errorCount++
    }
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
          reject(`Timeout [${timeout}]`)
        })
      } catch (ex) {
        this.addError("getHttpResponse", ex)
        reject(ex)
      }
    })
  }

}
