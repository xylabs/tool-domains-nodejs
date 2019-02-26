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
        console.log(JSON.stringify(resourceRecordData))
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

  private async getHttpResponse(url: string, ssl = false, timeout = 1000): Promise<string> {
    const prefix = ssl ? "https" : "http"
    const func = ssl ? https : http
    return new Promise<string>((resolve, reject) => {
      try {
        func.get(`${prefix}://${url}`, { timeout }, (res) => {
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

  private async reverseDns(address: string): Promise<object> {
    return new Promise((resolve, reject) => {
      dns.reverse(address, (errReverse, hostnames) => {
        const result: any = {}
        result.reverseDns = {}
        if (errReverse) {
          result.reverseDns.error = errReverse
        } else {
          result.reverseDns.hostNames = hostnames
        }
        resolve(result)
      })
    })
  }

  private async dnsLookup(name: string): Promise<object> {
    return new Promise((resolve, reject) => {
      dns.lookup(name, { all: true }, (err, addresses) => {
        if (err) {
          resolve(err)
        } else {
          resolve(addresses)
        }
      })
    })
  }

  private async validateRecordSet_A_CNAME(recordSet: Route53.Types.ResourceRecordSet): Promise<any> {
    const result: any = {}
    result.addresses = await this.dnsLookup(recordSet.Name)
    result.http = await this.getHttpResponse(recordSet.Name)
    result.https = await this.getHttpResponse(recordSet.Name, true)
    if (result.addresses && result.addresses.length > 0) {
      result.reverseDns = await this.reverseDns(result.addresses[0].address)
    }
    return result
  }

  private async validateRecordSet_MX(recordSet: Route53.Types.ResourceRecordSet): Promise<any> {
    const result: any = {}
    result.addresses = await this.dnsLookup(recordSet.Name)
    if (result.addresses && result.addresses.length > 0) {
      result.reverseDns = await this.reverseDns(result.addresses[0].address)
    }
    return result
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
