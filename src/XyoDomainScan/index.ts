import {Route53} from 'aws-sdk'

export class XyoDomainScan {

  private router53Data?: Route53.Types.ListHostedZonesResponse
  private r53 = new Route53()

  private async getZones(): Promise<any> {
    let self = this
    return new Promise((resolve, reject) => {
      let params = { MaxItems: '1000'}
  
      this.r53.listHostedZones(params, function(err, data) {
        if (err) {
          console.log(err, err.stack)
        } else {
          resolve(data)
        }
      })
    })
  }

  private async getResources(zone: Route53.Types.HostedZone) {
    let self = this
    return new Promise((resolve, reject) => {
      let params = {
        HostedZoneId: zone.Id,
        MaxItems: '1000'
      }
  
      this.r53.listResourceRecordSets(params, function(err, data) {
        if (err) {
          console.log(err, err.stack)
        } else {
          resolve(data)
        }
      })
    })
  }

  public async start() {
    console.log("Running...")
    this.router53Data = (await this.getZones())
    if (this.router53Data) {
      this.router53Data.HostedZones.forEach(async (zone) => {
        let resources = await this.getResources(zone)
        console.log(resources)
      })
    }
  }
}