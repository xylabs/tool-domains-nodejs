import {Route53} from 'aws-sdk'
import dns from 'dns'
import fs from 'fs'
import http from 'http'
import https from 'https'

export class XyoDomainScan {

  private r53 = new Route53()

  private async getZones(): Promise<Route53.Types.ListHostedZonesResponse> {
    return new Promise((resolve, reject) => {
      let params = {}
  
      this.r53.listHostedZones(params, function(err, data) {
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
      let params = {
        HostedZoneId: zone.Id
      }
  
      this.r53.listResourceRecordSets(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  private async getHttpResponse(url: string, timeout = 1000): Promise<String> {
    return new Promise<String>((resolve, reject) => {
      try {
        http.get(`http://${url}`, {timeout}, (res) => {
          resolve(`${res.statusCode}`)
        }).on('error', (e) => {
          resolve(e.message)
        }).setTimeout(timeout, () => {
          resolve(`Timeout [${timeout}]`)
        })
      } catch(ex) {
        resolve(`${ex.message}: ${url}`)
      }
    })
  }

  private async getHttpsResponse(url: string, timeout = 1000): Promise<String> {
    return new Promise<String>((resolve, reject) => {
      try {
        https.get(`https://${url}`, {timeout}, (res) => {
          resolve(`${res.statusCode}`)
        }).on('error', (e) => {
          resolve(e.message)
        }).setTimeout(timeout, () => {
          resolve(`Timeout [${timeout}]`)
        })
      } catch(ex) {
        resolve(`${ex.message}: ${url}`)
      }
    })
  }

  private async validateRecordSet_A_CNAME(recordSet: Route53.Types.ResourceRecordSet): Promise<any> {
    return new Promise((resolve, reject) => {
      let result:any = {}
      dns.lookup(recordSet.Name, {all: true}, (err, addresses) => {
        if (err) {
          console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`)
          resolve(result)
        } else {
          (async() => {
            result.http = await this.getHttpResponse(recordSet.Name)
            result.https = await this.getHttpsResponse(recordSet.Name)
            dns.reverse(addresses[0].address, (err, hostnames) => {
              result.reverseDns = {}
              if (err) {
                result.reverseDns.error = err
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
      let result:any = {}
      dns.lookup(recordSet.Name, {all: true}, (err, addresses) => {
        if (err) {
          console.log(`${recordSet.Name}(${recordSet.Type}): [${JSON.stringify(result)}]`)
          resolve(result)
        } else {
          dns.reverse(addresses[0].address, (err, hostnames) => {
            result.reverseDns = {}
            if (err) {
              result.reverseDns.error = err
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
      switch(recordSet.Type) {
        case 'A':
        case 'CNAME':
          return this.validateRecordSet_A_CNAME(recordSet)
        case 'MX':
          return this.validateRecordSet_MX(recordSet)
        default:
          return {}
      }
  }

  private async saveToFile(obj: Object) {
    fs.open('output.json', 'w', (err, fd) => {
      if (err) {
        console.log(`failed to open file: ${err}`)
      } else {
        fs.write(fd, JSON.stringify(obj), (err) => {
          if (err) {
            console.log(`failed to write file: ${err}`)
          }
        })
      }
    })
  }

  public async start() {
    console.log("Running...")
    let zones = await this.getZones()
    let result:any = {
      Zones: Array<any>()
    }
    for (let zone of zones.HostedZones) {
      let zoneData = {
        Info: zone,
        ResourceRecordSets: new Array<any>()
      }
      let resourceRecordSetResponse = await this.getResources(zone)
      for (let recordSet of resourceRecordSetResponse.ResourceRecordSets) {
        let resourceRecordData = {
          RecordSet: recordSet,
          Validation: await this.validateRecordSet(recordSet)
        }
        zoneData.ResourceRecordSets.push(resourceRecordData)
      }
      result.Zones.push(zoneData)
    }
    this.saveToFile(result)
  }
}