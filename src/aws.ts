import { Route53, S3 } from 'aws-sdk'
import chalk from 'chalk'

export class AWS {
  private r53 = new Route53()
  private s3 = new S3()

  public async getDomains(): Promise<string[]> {
    const zones = await this.getZones()
    const result: string[] = []

    console.log(`AWS Zones Found: ${zones.HostedZones.length}`)

    for (const zone of zones.HostedZones) {
      const resourceRecordSetResponse = await this.getResources(zone)
      for (const recordSet of resourceRecordSetResponse.ResourceRecordSets) {
        result.push(recordSet.Name)
      }
    }
    return result
  }

  public saveFileToS3(bucket: string, filename: string, data: object) {
    console.log(chalk.gray(`Saving to S3`))
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from(JSON.stringify(data))
      const params = {
        Bucket: bucket,
        Key: filename,
        Body: buffer
      }

      this.s3.upload(params, (err: any, result: any) => {
        if (err) {
          console.error(chalk.red(`aws.saveFileToS3: ${err}`))
          reject(err)
        } else {
          console.log(chalk.gray(`Saved to S3: ${filename}`))
          resolve(result)
        }
      })
    })
  }

  private async getZones(): Promise<Route53.Types.ListHostedZonesResponse> {
    console.log(chalk.gray(`Getting AWS Zones`))
    return new Promise((resolve, reject) => {
      const params = {}

      this.r53.listHostedZones(params, (err, data) => {
        if (err) {
          console.error(chalk.red(`aws.getZones: ${err}`))
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
}
