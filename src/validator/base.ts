import http from 'http'
import https from 'https'
import { Config } from '../config'

export class BaseValidator {
  public name: string
  public config: Config
  public errors?: string[]
  public errorCount = 0

  constructor(name: string, config: Config) {
    this.name = name
    this.config = config
  }

  public addError(err: string) {
    this.errors = this.errors || []
    this.errors.push(err)
    this.errorCount++
  }

  protected async getHttpResponse(ssl = false, timeout = 1000): Promise < string > {
    const prefix = ssl ? "https" : "http"
    const func = ssl ? https : http
    return new Promise<string>((resolve, reject) => {
      try {
        func.get(`${prefix}://${this.name}`, { timeout }, (res) => {
          resolve(`${res.statusCode}`)
        }).on('error', (e) => {
          resolve(e.message)
        }).setTimeout(timeout, () => {
          resolve(`Timeout [${timeout}]`)
        })
      } catch (ex) {
        resolve(`${ex.message}: ${this.name}`)
      }
    })
  }

}
