import loadJsonFile from 'load-json-file'
import { AWS } from './aws'
import { DomainConfig } from './domain'
import chalk from 'chalk'
import { DomainsConfig } from './domains'

export class Config {

  public static async load(fileName: string = './dnslint.json'): Promise<Config> {
    return new Promise((resolve, reject) => {
      try {
        loadJsonFile(fileName).then((json: any) => {
          const config = new Config()
          resolve({ ...config, ...(json) })
        })
      } catch (ex) {
        console.log(chalk.yellow("No dnslint.json config file found.  Using defaults."))
        resolve(new Config())
      }
    })
  }

  public aws?: AWS = undefined
  public domains?: DomainsConfig

  public getRecordTimeout(domainName: string, recordName: string): number {
    let timeout = 1000
    if (this.domains !== undefined) {
      const domainConfig: DomainConfig = this.domains[domainName]
      if (domainConfig) {
        timeout = domainConfig.getTimeout(recordName)
      }
    }
    return timeout
  }

  public isRecordEnabled(domainName: string, recordName: string): boolean {
    if (this.domains !== undefined) {
      const domainConfig: DomainConfig = this.domains[domainName]
      if (domainConfig) {
        return domainConfig.isRecordEnabled(recordName)
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
