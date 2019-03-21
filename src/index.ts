import { AWS } from './aws'
import fs from 'fs'
import { Config } from './config'
import { oc } from 'ts-optchain'
import chalk from 'chalk'
import { DomainValidator } from './validator'
import { DomainsConfig } from './config/domains'

export class XyDomainScan {

  private aws = new AWS()
  private config = new Config()

  public async start(singleDomain?: string, config?: Config) {
    this.config = await Config.load({ config })
    const domains = new Map<string, DomainValidator>()
    const result: any = {
      domains: [],
      errorCount: 0
    }

    // special case if domain specified
    if (singleDomain) {
      domains.set(singleDomain, new DomainValidator(singleDomain, this.config))
    } else {

      console.log(chalk.gray("Getting Domains"))

      if (oc(this.config).aws.enabled(true)) {
        await this.addAWSDomains(domains)
      }

      console.log(chalk.gray("Getting Config Domains"))
      if (this.config.domains) {
        await this.addDomains(domains, this.config.domains)
      }
    }

    console.log(`Domains Found: ${domains.size}`)

    let completedDomains = 0
    for (const domain of domains.values()) {
      try {
        completedDomains++
        result.domains.push(domain)
        console.log(`Domain:[${completedDomains}/${domains.size}]: ${domain.name} [${domain.serverType}]`)
        result.errorCount += await domain.validate()
      } catch (ex) {
        result.errorCount++
        console.error(chalk.red(ex.message))
        console.error(chalk.red(ex.stack))
      }
    }

    console.log(`Saving to File: output.json`)
    this.saveToFile("output.json", result)
    if (result.errorCount === 0) {
      console.log(chalk.green("Congratulations, all tests passed!"))
    } else {
      console.error(chalk.yellow(`Total Errors Found: ${result.errorCount}`))
    }
    return result
  }

  private async addAWSDomains(domains: Map<string, DomainValidator>) {
    console.log(chalk.gray("Getting AWS Domains"))
    try {
      const awsDomains = await this.aws.getDomains()
      console.log(chalk.gray(`AWS Domains Found: ${awsDomains.length}`))
      for (const domain of awsDomains) {
        domains.set(domain, new DomainValidator(domain, this.config))
      }
    } catch (ex) {
      console.error(chalk.red(`AWS Domains Error: ${ex.message}`))
    }
    return domains
  }

  private async addDomains(domains: Map<string, DomainValidator>, domainsConfig: DomainsConfig) {
    if (domainsConfig) {
      for (const domain of domainsConfig) {
        if ((domain.name !== "default") && (domain.enabled === undefined || domain.enabled)) {
          domains.set(domain.name, new DomainValidator(domain.name, this.config))
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
