import { AWS } from './aws'
import fs from 'fs'
import { Config, Domain } from './config'
import { RecordValidator, DomainValidator } from './validator'
import { oc } from 'ts-optchain'
import { DNS } from './dns'

export class XyDomainScan {

  private aws = new AWS()
  private config?: Config

  public async start() {
    this.config = await Config.load()
    const domains = new Map<string, DomainValidator>()
    const result: any = {
      domains: [],
      errorCount: 0
    }

    if (oc(this.config).aws.enabled(true)) {
      await this.addAWSDomains(domains)
    }

    await this.addConfigDomains(domains)

    console.log(`Domains Found: ${domains.size}`)

    let completedDomains = 0
    for (const domain of domains.values()) {
      completedDomains++
      result.domains.push(domain)
      console.log(`Domain:[${completedDomains}/${domains.size}]: ${domain.name}`)
      result.errorCount += await domain.validate(this.config)
    }

    console.log(`Saving to File: output.json`)
    console.log(JSON.stringify(result))
    this.saveToFile("output.json", result)
  }

  private async addAWSDomains(domains: Map<string, DomainValidator>) {
    const awsDomains = await this.aws.getDomains()
    for (const domain of awsDomains) {
      domains.set(domain, new DomainValidator(domain))
    }
    return domains
  }

  private async addConfigDomains(domains: Map<string, DomainValidator>) {
    if (this.config && this.config.domains) {
      for (const domain of this.config.domains) {
        domains.set(domain.name, new DomainValidator(domain.name))
      }
    }
    return domains
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
