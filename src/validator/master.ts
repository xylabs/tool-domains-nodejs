import { MasterConfig } from '../config'
import { Validator } from './validator'
import { DomainValidator } from './domain'
import { AWS } from '../aws'
import chalk from 'chalk'

export class MasterValidator extends Validator<MasterConfig> {

  public domains: DomainValidator[] = []

  constructor(config: MasterConfig) {
    super(config)
  }

  public async validate() {
    this.addDomainsFromConfig()
    if (this.config.aws && this.config.aws.enabled) {
      await this.addDomainsFromAws()
    }

    let completedDomains = 0
    for (const domain of Object.values(this.domains)) {
      try {
        const errors = await domain.validate()
        completedDomains++
        console.log(`Domain:[${completedDomains}/${this.domains.length}]: ${domain.name} [${domain.type}]`)
        this.errorCount += errors
      } catch (ex) {
        this.addError("MasterValidator.validate", `Unexpected Error: ${ex.message}`)
        console.error(chalk.red(ex.message))
        console.error(chalk.red(ex.stack))
        this.errorCount++
      }
    }

    return super.validate()
  }

  private addDomainsFromConfig() {
    if (this.config.domains) {
      for (const domain of this.config.domains.values()) {
        if (domain.name !== "default") {
          console.log(chalk.yellow(`Adding Domain from Config: ${domain.name}`))
          const domainConfig = this.config.getDomainConfig(domain.name)
          this.domains.push(new DomainValidator(domainConfig, this.config.getServerType(domainConfig.name)))
        }
      }
    }
  }

  private async addDomainsFromAws() {
    console.log(chalk.gray("Getting AWS Domains"))
    try {
      const aws = new AWS()
      const awsDomains = await aws.getDomains()
      console.log(chalk.gray(`AWS Domains Found: ${awsDomains.length}`))
      for (const domain of awsDomains) {
        // remove trailing '.'
        const cleanDomain = domain.slice(0, domain.length - 1)
        const domainConfig = this.config.getDomainConfig(cleanDomain)

        if (this.config.aws.filter) {
          if (!domainConfig.name.match(this.config.aws.filter)) {
            continue
          }
        }

        if (!domainConfig.isEnabled()) {
          continue
        }

        this.domains.push(new DomainValidator(domainConfig, this.config.getServerType(cleanDomain)))
      }
    } catch (ex) {
      console.error(chalk.red(`AWS Domains Error: ${ex.message}`))
    }
  }
}
