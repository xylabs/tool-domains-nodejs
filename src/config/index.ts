import loadJsonFile from 'load-json-file'
import { AWS } from './aws'
import { DomainConfig } from './domain'
import chalk from 'chalk'
import { DomainsConfig } from './domains'
import defaultConfig from './default.json'
import _ from 'lodash'
import { ServersConfig } from './servers'
import Ajv from 'ajv'
import schema from '../schema/dnslint.schema.json'
import { RecordConfig } from './record'

export class Config {

  public static async load(filename: string = './dnslint.json'): Promise<Config> {
    try {
      const ajv = new Ajv({ schemaId: 'id' })
      const validate = ajv.compile(schema)
      if (!validate(defaultConfig)) {
        console.error(chalk.red(`${validate.errors}`))
      } else {
        console.log(chalk.green("Default Config Validated"))
      }
      try {
        const userJson: object = await loadJsonFile(filename)
        if (!validate(userJson)) {
          console.error(chalk.red(`${validate.errors}`))
        } else {
          console.log(chalk.green("User Config Validated"))
        }
        console.log(chalk.gray("Loaded User Config"))
        const result = new Config(_.mergeWith(defaultConfig, userJson,
          (objValue: any, srcValue: any, key: any, object: any, source: any, stack: any) => {
            return undefined
          }
        ))
        return result
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
  public domains?: DomainsConfig
  public servers?: ServersConfig

  constructor(config?: any) {
    if (config) {
      Object.assign(this, config)
    }
    this.domains = new DomainsConfig().concat(this.domains || [])
    this.servers = new ServersConfig().concat(this.servers || [])
  }

  public getDomains() {
    if (!this.domains) {
      this.domains = new DomainsConfig()
    }
    return this.domains
  }

  public getServers() {
    if (!this.servers) {
      this.servers = new ServersConfig()
    }
    return this.servers
  }

  public getRecordConfig(domain: string, recordType: string) {
    const serverType = this.getServerType(domain)
    const result = new RecordConfig(recordType)
    if (this.servers !== undefined) {
      const records = this.servers.getConfig(serverType).records
      if (records) {
        Object.assign(result, records.getConfig(recordType))
      }
    }
    if (this.domains !== undefined) {
      const records = this.domains.getConfig(domain).records
      if (records) {
        Object.assign(result, records.getConfig(recordType))
      }
    }
    return result
  }

  public getDomainConfig(domain: string) {
    const result = new DomainConfig(domain)
    if (this.domains !== undefined) {
      Object.assign(result, this.domains.getConfig(domain))
    }
    return result
  }

  public getServerType(domain: string) {
    let defaultName = "unknown"
    if (this.servers) {
      for (const server of this.servers) {
        const include = server.include
        if (include) {
          for (const filter of include) {
            if (domain.match(filter)) {
              return server.name
            }
            if (server.default) {
              defaultName = server.name
            }
          }
        }
      }
    }
    return defaultName
  }
}
