import { AWSConfig } from './aws'
import { DomainConfig } from './domain'
import chalk from 'chalk'
import _ from 'lodash'
import Ajv from 'ajv'
import schema from '../schema/dnslint.schema.json'
import { RecordConfig } from './record'
import { Config } from './config'
import { Configs } from './configs'
import { ServerConfig } from './server'

export class MasterConfig extends Config {

  public static parse(source: any) {
    let srcObj = source
    if (typeof source === "string") {
      srcObj = JSON.parse(source)
    }
    const master = _.merge(new MasterConfig(), srcObj)
    master.domains = new Configs<DomainConfig>()
    if (srcObj.domains) {
      for (const domain of srcObj.domains) {
        const serverType = master.getServerType(domain.name)
        const newDomainObj = DomainConfig.parse(domain, serverType)
        master.domains.set(newDomainObj.name, newDomainObj)
      }
    }
    master.servers = new Configs<ServerConfig>()
    if (srcObj.servers) {
      for (const server of srcObj.servers) {
        const newServerObj = ServerConfig.parse(server)
        master.servers.set(newServerObj.name, newServerObj)
      }
    }
    return master
  }

  public aws = new AWSConfig()
  public domains = new Configs<DomainConfig>()
  public servers = new Configs<ServerConfig>()

  public merge(config?: MasterConfig) {
    if (config) {
      this.aws = this.aws.merge(config.aws)
      this.domains = this.domains.merge(config.domains)
      this.servers = this.servers.merge(config.servers)
    }
    return this
  }

  public getRecordConfig(domain: string, recordType: string) {
    const serverType = this.getServerType(domain)
    let serverRecord = new RecordConfig(recordType, domain)
    let domainRecord = new RecordConfig(recordType, domain)

    if (this.servers !== undefined) {
      const serverConfig = this.servers.getConfig(serverType)
      if (serverConfig && serverConfig.records) {
        const record = serverConfig.records.getConfig(recordType)
        if (record) {
          serverRecord = record
        }
      }
    }

    if (this.domains !== undefined) {
      const domainConfig = this.domains.getConfig(domain)
      if (domainConfig && domainConfig.records) {
        const record = domainConfig.records.getConfig(recordType)
        if (record) {
          domainRecord = record
        }
      }
    }

    return serverRecord.merge(domainRecord)
  }

  public getRecordConfigs(domain: string): Configs<RecordConfig> {
    const result = new Configs<RecordConfig>()
    const serverType = this.getServerType(domain)
    if (this.servers !== undefined) {
      const serverConfig = this.servers.getConfig(serverType)
      if (serverConfig) {
        const records = serverConfig.records
        if (records) {
          for (const record of records.values()) {
            if (record.type) {
              const existing = result.get(record.type)
              if (existing === undefined) {
                result.set(record.type, this.getRecordConfig(domain, record.type))
              } else {
                result.set(record.type, existing.merge(this.getRecordConfig(domain, record.type)))
              }
            }
          }
        }
      }
    }

    if (this.domains !== undefined) {
      const domainConfig = this.domains.getConfig(domain)
      if (domainConfig) {
        const records = domainConfig.records
        if (records) {
          for (const record of records.values()) {
            if (record.type) {
              const existing = result.get(record.type)
              if (existing === undefined) {
                result.set(record.type, this.getRecordConfig(domain, record.type))
              } else {
                result.set(record.type, existing.merge(this.getRecordConfig(domain, record.type)))
              }
            }
          }
        }
      }
    }
    return result
  }

  public getDomainConfig(domain: string) {
    let result = new DomainConfig(domain, this.getServerType(domain))
    if (this.domains !== undefined) {
      result = result.merge(this.domains.getConfig(domain))
      result.records = this.getRecordConfigs(domain)
    }
    result.name = domain
    return result
  }

  public getServerConfig(server: string) {
    let result = new ServerConfig(server)
    if (this.servers !== undefined) {
      result = _.merge(result, this.servers.getConfig(server))
    }
    return result
  }

  public getServerType(domain: string) {
    console.log(chalk.magenta(`getServerType: ${domain}: ${this.servers.size}`))
    let defaultName = "unknown"
    if (this.servers) {
      for (const server of this.servers.values()) {
        console.log(chalk.magenta(`getServerType: ${server.name}`))
        const include = server.include
        if (include) {
          for (const filter of include) {
            console.log(chalk.magenta(`getServerType.filter: ${filter}`))
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
    console.log(chalk.magenta(`getServerType.result: ${defaultName}`))
    return defaultName
  }
}
