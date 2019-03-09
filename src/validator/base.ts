import http from 'http'
import https from 'https'

export class BaseValidator {
  public name: string
  public errors?: string[]

  constructor(name: string) {
    this.name = name
  }

  public addError(err: string) {
    this.errors = this.errors || []
    this.errors.push(err)
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
