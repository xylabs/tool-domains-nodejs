import { BaseValidator } from '../base'
import { Config } from '../../config'
import { DNS } from '../../dns'
import http from 'http'
import https from 'https'
import chalk from 'chalk'
export class RecordValidator extends BaseValidator {

  public type: string
  public addresses?: any
  public http?: any
  public https?: any
  public reverseDns?: any

  constructor(name: string, type: string) {
    super(name)
    this.type = type
  }

  public async validate(timeout: number): Promise<number> {
    if (this.errors) {
      return this.errors.length
    }
    return 0
  }

  protected async checkHttp(timeout: number) {
    try {
      this.http = await this.getHttpResponse(false, timeout)
    } catch (ex) {
      this.addError("http", ex)
    }
  }

  protected async checkHttps(timeout: number) {
    try {
      this.https = await this.getHttpResponse(true, timeout)
    } catch (ex) {
      this.addError("https", ex)
    }
  }

  protected async lookup() {
    try {
      this.addresses = await DNS.lookup(this.name)
    } catch (ex) {
      this.addError("lookup", ex)
    }
  }

  protected async reverseLookup() {
    try {
      this.reverseDns = await DNS.reverse(this.name)
    } catch (ex) {
      this.addError("reverseLookup", ex)
    }
  }

  private async getHttpResponse(ssl = false, timeout = 5000): Promise < string > {
    const prefix = ssl ? "https" : "http"
    const func = ssl ? https : http
    return new Promise<string>((resolve, reject) => {
      try {
        func.get(`${prefix}://${this.name}`, { timeout }, (res) => {
          resolve(`${res.statusCode}`)
        }).on('error', (e) => {
          reject(e.message)
        }).setTimeout(timeout, () => {
          reject(`Timeout [${timeout}]`)
        })
      } catch (ex) {
        reject(ex)
      }
    })
  }

}
