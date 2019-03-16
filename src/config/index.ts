import loadJsonFile from 'load-json-file'
import { AWS } from './aws'
import { DomainConfig } from './domain'
import chalk from 'chalk'
import { DomainsConfig } from './domains'
import defaultConfig from './default.json'
import merge from 'merge'
import { ServersConfig } from './servers'

export class Config {

  public static async load(filename: string = './dnslint.json'): Promise<Config> {
    try {
      const defaultJson = await loadJsonFile(`${__dirname}/default.json`)
      try {
        const userJson = await loadJsonFile(filename)
        console.log(chalk.gray("Loaded User Config"))
        return new Config(merge.recursive(true, defaultConfig, userJson))
      } catch (ex) {
        console.log(chalk.yellow("No dnslint.json config file found.  Using defaults."))
        return new Config(defaultConfig)
      }
    } catch (ex) {
      console.log(chalk.red(`Failed to load defaults: ${ex}`))
      return new Config()
    }
  }

  public aws ?: AWS = undefined
  public domains ?: DomainsConfig
  public servers ?: ServersConfig

  constructor(config?: any) {
    if (config) {
      Object.assign(this, config)
    }
  }

  public getRecordTimeout(domainName: string, recordType: string): number {
    let timeout = 1000
    if (this.domains !== undefined) {
      const domainConfig: DomainConfig = this.domains[domainName] || this.domains.default
      if (domainConfig) {
        const config = new DomainConfig(domainConfig)
        timeout = config.getRecordConfigProperty(recordType, "timeout")
      }
    }
    return timeout
  }

  public isRecordEnabled(domainName: string, recordName: string): boolean {
    if (this.domains !== undefined) {
      const domainConfig: DomainConfig = this.domains[domainName]
      if (domainConfig) {
        const config = new DomainConfig(domainConfig)
        return config.isRecordEnabled(recordName)
      }
    }
    return true
  }

  public isReverseDNSEnabled(domainName: string, recordName: string): boolean {
    if (this.domains !== undefined) {
      const domainConfig: DomainConfig = this.domains[domainName]
      if (domainConfig) {
        return domainConfig.isReverseDNSEnabled(recordName)
      }
    }
    return true
  }
}
