import { Route53 } from 'aws-sdk'
import dns from 'dns'
import fs from 'fs'
import http from 'http'
import https from 'https'

export class XyDomainScan {

  private r53 = new Route53()

  public async start() {
    console.log("Running...")
    const zones = await this.getZones()
    const result: any = {
      Zones: Array<any>()
    }

    for (const zone of zones.HostedZones) {
      const recordSetArray: any[] = []
      const zoneData = {
        Info: zone,
        ResourceRecordSets: recordSetArray
      }
      const resourceRecordSetResponse = await this.getResources(zone)
      for (const recordSet of resourceRecordSetResponse.ResourceRecordSets) {
        const resourceRecordData = {
          RecordSet: recordSet,
          Validation: await this.validateRecordSet(recordSet)
        }
        zoneData.ResourceRecordSets.push(resourceRecordData)
      }
      result.Zones.push(zoneData)
    }
    this.saveToFile(result)
  }

  private async getZones(): Promise<Route53.Types.ListHostedZonesResponse> {
    return new Promise((resolve, reject) => {
      const params = {}

      this.r53.listHostedZones(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  private async getResources(zone: Route53.Types.HostedZone): Promise<Route53.Types.ListResourceRecordSetsResponse> {
    return new Promise((resolve, reject) => {
      const params = {
        HostedZoneId: zone.Id
      }

      this.r53.listResourceRecordSets(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  private async getHttpResponse(url: string, timeout = 1000): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        http.get(`http://${url}`, { timeout }, (res) => {
          resolve(`${res.statusCode}`)
        }).on('error', (e) => {
          resolve(e.message)
        }).setTimeout(timeout, () => {
          resolve(`Timeout [${timeout}]`)
        })
      } catch (ex) {
        resolve(`${ex.message}: ${url}`)
      }
    })
  }

  private async getHttpsResponse(url: string, timeout = 1000): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        https.get(`https://${url}`, { timeout }, (res) => {
          resolve(`${res.statusCode}`)
        }).on('error', (e) => {
          resolve(e.message)
        }).setTimeout(timeout, () => {
          resolve(`Timeout [${timeout}]`)
        })
      } catch (ex) {
        resolve(`${ex.message}: ${url}`)
      }
    })
  }

  private async validateRecordSet_A_CNAME(recordSet: Route53.Types.ResourceRecordSet): Promise<any> {
    return new Promise((resolve, reject) => {
      const result: any = {}
      dns.lookup(recordSet.Name, { all: true }, (err, addresses) => {
        if (err) {
          console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`)
          resolve(result)
        } else {
          (async() => {
            result.http = await this.getHttpResponse(recordSet.Name)
            result.https = await this.getHttpsResponse(recordSet.Name)
            dns.reverse(addresses[0].address, (errReverse, hostnames) => {
              result.reverseDns = {}
              if (errReverse) {
                result.reverseDns.error = errReverse
              } else {
                result.reverseDns.hostNames = hostnames
              }
              console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`)
              resolve(result)
            })
          })()
        }
      })
    })
  }

  private async validateRecordSet_MX(recordSet: Route53.Types.ResourceRecordSet): Promise<any> {
    return new Promise((resolve, reject) => {
      const result: any = {}
      dns.lookup(recordSet.Name, { all: true }, (err, addresses) => {
        if (err) {
          console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`)
          resolve(result)
        } else {
          dns.reverse(addresses[0].address, (errReverse, hostnames) => {
            result.reverseDns = {}
            if (errReverse) {
              result.reverseDns.error = errReverse
            } else {
              result.reverseDns.hostNames = hostnames
            }
            console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`)
            resolve(result)
          })
        }
      })
    })
  }

  private async validateRecordSet(recordSet: Route53.Types.ResourceRecordSet) {
    switch (recordSet.Type) {
      case 'A':
      case 'CNAME':
        return this.validateRecordSet_A_CNAME(recordSet)
      case 'MX':
        return this.validateRecordSet_MX(recordSet)
      default:
        return {}
    }
  }

  private async saveToFile(obj: object) {
    fs.open('output.json', 'w', (err, fd) => {
      if (err) {
        console.log(`failed to open file: ${err}`)
      } else {
        fs.write(fd, JSON.stringify(obj), (errWrite) => {
          if (errWrite) {
            console.log(`failed to write file: ${errWrite}`)
          }
        })
      }
    })
  }
}
