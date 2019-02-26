import { Route53 } from 'aws-sdk'
import dns from 'dns'
import fs from 'fs'
import http from 'http'
import https from 'https'
import { isArray } from 'util'

export class XyDomainScan {

  private r53 = new Route53()

  public async start() {
    const zones = await this.getZones()
    const result: any = {
      Zones: Array<any>()
    }

    console.log(`Zones Found: ${zones.HostedZones.length}`)

    let completedZones = 0
    const zoneCount = zones.HostedZones.length

    for (const zone of zones.HostedZones) {
      completedZones++
      console.log(`Processing Zone: ${zone.Name}: [${completedZones}/${zoneCount}]`)
      const recordSetArray: any[] = []
      const zoneData = {
        Info: zone,
        ResourceRecordSets: recordSetArray
      }
      const resourceRecordSetResponse = await this.getResources(zone)
      let completedRecordSets = 0
      const recordSetCount = resourceRecordSetResponse.ResourceRecordSets.length
      for (const recordSet of resourceRecordSetResponse.ResourceRecordSets) {
        completedRecordSets++
        console.log(
          `Zone:[${completedZones}/${zoneCount}] Record:[${completedRecordSets}/${recordSetCount}]: ${recordSet.Name}`
          )
        const resourceRecordData = {
          RecordSet: recordSet,
          Validation: await this.validateRecordSet(recordSet)
        }
        zoneData.ResourceRecordSets.push(resourceRecordData)
      }
      result.Zones.push(zoneData)
    }
    console.log(`Saving to File: output.json`)
    this.saveToFile("output.json", result)
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

  private async reverseDns(addresses: any): Promise<object> {
    return new Promise((resolve, reject) => {
      if (isArray(addresses)) {
        dns.reverse(addresses[0], (err, hostNames) => {
          resolve({ err, hostNames })
        })
      } else {
        resolve({ err: "Invalid Address" })
      }
    })
  }

  private async dnsLookup(name: string): Promise<object> {
    return new Promise((resolve, reject) => {
      dns.lookup(name, { all: true }, (err, addresses) => {
        resolve({ err, addresses })
      })
    })
  }

  private async validateRecordSet_A_CNAME(recordSet: Route53.Types.ResourceRecordSet): Promise<any> {
    const result: any = {}
    result.addresses = await this.dnsLookup(recordSet.Name)
    result.http = await this.getHttpResponse(recordSet.Name)
    result.https = await this.getHttpResponse(recordSet.Name, true)
    result.reverseDns = await this.reverseDns(result.addresses)
    return result
  }

  private async validateRecordSet_MX(recordSet: Route53.Types.ResourceRecordSet): Promise<any> {
    const result: any = {}
    result.addresses = await this.dnsLookup(recordSet.Name)
    result.reverseDns = await this.reverseDns(result.addresses)
    return result
  }

  private async validateRecordSet(recordSet: Route53.Types.ResourceRecordSet): Promise<any> {
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

  private async saveToFile(filename: string, obj: object) {
    fs.open(filename, 'w', (err, fd) => {
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
