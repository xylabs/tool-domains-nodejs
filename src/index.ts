import { AWS } from './aws'
import fs from 'fs'
import { Config } from './config'
import { DomainConfig } from './config/domain'
import { RecordValidator, DomainValidator } from './validator'
import { oc } from 'ts-optchain'
import { DNS } from './dns'
import { DomainValidatorWebsite } from './validator/domain/website'
import { DomainValidatorDomainKey } from './validator/domain/domainkey'
import { DomainValidatorApi } from './validator/domain/api'

export class XyDomainScan {

  private aws = new AWS()
  private config = new Config()

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
      console.log(`Domain:[${completedDomains}/${domains.size}]: ${domain.name} [${domain.serverType}]`)
      result.errorCount += await domain.validate(this.config)
    }

    console.log(`Saving to File: output.json`)
    this.saveToFile("output.json", result)
    return result
  }

  private getServerType(domain: string) {
    if (this.config.servers) {
      for (const key of Object.keys(this.config.servers)) {
        const server = this.config.servers[key]
        const include = server.include
        if (include) {
          for (const filter of include) {
            if (domain.match(filter)) {
              return key
            }
          }
        }
      }
    }
  }

  private createValidator(domain: string) {
    switch (this.getServerType(domain)) {
      case "website":
        return new DomainValidatorWebsite({ name: domain })
      case "api":
        return new DomainValidatorApi({ name: domain })
      case "domainkey":
        return new DomainValidatorDomainKey({ name: domain })
    }
    return new DomainValidatorWebsite({ name: domain })
  }

  private async addAWSDomains(domains: Map<string, DomainValidator>) {
    const awsDomains = await this.aws.getDomains()
    for (const domain of awsDomains) {
      domains.set(domain, this.createValidator(domain))
    }
    return domains
  }

  private async addConfigDomains(domains: Map<string, DomainValidator>) {
    if (this.config && this.config.domains) {
      const keys = Object.keys(this.config.domains)
      for (const key of keys) {
        if (key !== "default") {
          const domain = this.config.domains[key]
          domains.set(key, this.createValidator(key))
        }
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
