import dns from 'dns'

export class DNS {

  public static async lookup(name: string): Promise < object > {
    return new Promise((resolve, reject) => {
      dns.lookup(name, { all: true }, (err, addresses) => {
        if (err) {
          reject(err)
        } else {
          resolve({ err, addresses })
        }
      })
    })
  }
  public static async resolveAny(name: string): Promise < dns.AnyRecord[] > {
    return new Promise((resolve, reject) => {
      dns.resolveAny(name, (err, records: dns.AnyRecord[]) => {
        if (err) {
          reject(err)
        } else {
          resolve(records)
        }
      })
    })
  }

  public static async reverse(addresses: string[]): Promise < string[] > {
    return new Promise((resolve, reject) => {
      if (addresses.length > 0) {
        dns.reverse(addresses[0], (err, hostNames) => {
          if (err) {
            reject(err)
          } else {
            resolve(hostNames)
          }
        })
      } else {
        reject("Need at least one address")
      }
    })
  }
}
