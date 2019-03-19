import loadJsonFile from 'load-json-file'
import { AWS } from './aws'
import { DomainConfig } from './domain'
import chalk from 'chalk'
import { DomainsConfig } from './domains'
import defaultConfig from './default.json'
import merge from 'merge'
import { ServersConfig } from './servers'
import Ajv from 'ajv'
import schema from '../schema/dnslint.schema.json'
import { RecordConfig } from './record'

export class Config {

  public static async load(filename: string = './dnslint.json'): Promise<Config> {
    try {
      const defaultJson = await loadJsonFile(`${__dirname}/default.json`)
      const ajv = new Ajv({ schemaId: 'id' })
      const validate = ajv.compile(schema)
      if (!validate(defaultJson)) {
        console.error(chalk.red(`${validate.errors}`))
      } else {
        console.log(chalk.green("Default Config Validated"))
      }
      try {
        const userJson = await loadJsonFile(filename)
        if (!validate(userJson)) {
          console.error(chalk.red(`${validate.errors}`))
        } else {
          console.log(chalk.green("User Config Validated"))
        }
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
    this.domains = new DomainsConfig().concat(this.domains || [])
    this.servers = new ServersConfig().concat(this.servers || [])
  }

  public getRecordConfig(serverType: string, domainName: string, recordType: string) {
    const result = new RecordConfig(recordType)
    if (this.servers !== undefined) {
      Object.assign(result, this.servers.getConfig(serverType))
    }
    if (this.domains !== undefined) {
      Object.assign(result, this.domains.getConfig(domainName))
    }
    return result
  }
}
