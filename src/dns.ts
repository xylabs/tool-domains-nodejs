import dns, { MxRecord } from 'dns'

import { DnsClient } from './dnsclient'

export class Dns {
  public static client = new DnsClient()

  public static lookup(name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      dns.lookup(name, 4, (err, address) => {
        if (err) {
          reject(err)
        } else {
          resolve(address)
        }
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async resolve(domain: string, type: string): Promise<any[]> {
    const result = await this.client.resolve(domain, type)
    const items = []
    for (const answer of result.answers) {
      if (answer.type === type) {
        items.push(answer)
      }
    }
    return items
  }

  public static resolve4(name: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      dns.resolve4(name, (err, records: string[]) => {
        if (err) {
          if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
            reject(err)
          } else {
            resolve([])
          }
        } else {
          resolve(records)
        }
      })
    })
  }

  public static resolveCname(name: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      dns.resolveCname(name, (err, records: string[]) => {
        if (err) {
          if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
            reject(err)
          } else {
            resolve([])
          }
        } else {
          resolve(records)
        }
      })
    })
  }

  public static resolveMx(name: string): Promise<MxRecord[]> {
    return new Promise((resolve, reject) => {
      dns.resolveMx(name, (err, records: MxRecord[]) => {
        if (err) {
          if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
            reject(err)
          } else {
            resolve([])
          }
        } else {
          resolve(records)
        }
      })
    })
  }

  public static resolveTxt(name: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      dns.resolveTxt(name, (err, records: string[][]) => {
        if (err) {
          if (err.code !== 'ENODATA' && err.code !== 'ENOTFOUND') {
            reject(err)
          } else {
            resolve([])
          }
        } else {
          resolve(records)
        }
      })
    })
  }

  public static reverse(address: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      dns.reverse(address, (err, hostNames) => {
        if (err) {
          reject(err)
        } else {
          resolve(hostNames)
        }
      })
    })
  }
}
