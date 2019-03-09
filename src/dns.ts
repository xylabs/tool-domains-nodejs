import dns from 'dns'

export class DNS {

  public static async lookup(name: string): Promise < string > {
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

  public static async reverse(address: string): Promise < string[] > {
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
