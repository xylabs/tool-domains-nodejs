import {
  HostedZone,
  ListHostedZonesByNameCommand,
  ListHostedZonesByNameCommandInput,
  ListResourceRecordSetsCommand,
  ListResourceRecordSetsCommandInput,
  Route53Client,
} from '@aws-sdk/client-route-53'
import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import chalk from 'chalk'
import uniq from 'lodash/uniq'

export class AWS {
  private r53 = new Route53Client({})

  private s3 = new S3Client({})

  public async getDomains(): Promise<string[]> {
    const zones = await this.getZones()
    const result: string[] = []

    if (zones?.HostedZones) {
      console.log(`AWS Zones Found: ${zones.HostedZones?.length}`)

      for (const zone of zones.HostedZones) {
        const resourceRecordSetResponse = await this.getResources(zone)
        if (resourceRecordSetResponse?.ResourceRecordSets) {
          for (const recordSet of resourceRecordSetResponse.ResourceRecordSets) {
            if (recordSet.Name) {
              result.push(recordSet.Name)
            }
          }
        }
      }
    }
    return uniq(result)
  }

  public async saveFileToS3(bucket: string, filename: string, data: object) {
    console.log(chalk.gray('Saving to S3'))

    const buffer = Buffer.from(JSON.stringify(data))
    const params: PutObjectCommandInput = {
      Body: buffer,
      Bucket: bucket,
      ContentType: 'application/json',
      Key: filename,
    }

    try {
      await this.s3.send(new PutObjectCommand(params))
      console.log(chalk.gray(`Saved to S3: ${filename}`))
    } catch (ex) {
      console.error(chalk.red(`aws.saveFileToS3: ${ex}`))
    }
  }

  private async getZones() {
    console.log(chalk.gray('Getting AWS Zones'))
    const params: ListHostedZonesByNameCommandInput = {}
    try {
      return await this.r53.send(new ListHostedZonesByNameCommand(params))
    } catch (ex) {
      console.error(chalk.red(`aws.getZones: ${ex}`))
    }
  }

  private async getResources(zone: HostedZone) {
    const params: ListResourceRecordSetsCommandInput = {
      HostedZoneId: zone.Id,
    }

    try {
      return await this.r53.send(new ListResourceRecordSetsCommand(params))
    } catch (ex) {
      console.error(chalk.red(`aws.getResources: ${ex}`))
    }
  }
}
