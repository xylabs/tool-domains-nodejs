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
import { RecordsConfig } from './records'

export class MasterConfig extends Config {

  public static parse(source: any) {
    let srcObj = source
    if (typeof source === "string") {
      srcObj = JSON.parse(source)
    }
    const master = _.merge(new MasterConfig("master"), srcObj)
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

  public aws = new AWSConfig("aws")
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
      const serverConfig = this.servers.getConfig(serverType, new ServerConfig(domain))
      if (serverConfig && serverConfig.records) {
        const record = serverConfig.records.getConfig(recordType, new RecordConfig(recordType, domain))
        if (record) {
          // create new object to prevent changing the authority object
          serverRecord = new RecordConfig(recordType, domain).merge(record)
        }
      }
    }

    if (this.domains !== undefined) {
      const domainConfig = this.domains.getConfig(domain, new DomainConfig(domain, this.getServerType(domain)))
      if (domainConfig && domainConfig.records) {
        const record = domainConfig.records.getConfig(recordType, new RecordConfig(recordType, domain))
        if (record) {
          // create new object to prevent changing the authority object
          domainRecord = new RecordConfig(recordType, domain).merge(record)
        }
      }
    }

    return serverRecord.merge(domainRecord)
  }

  public getRecordConfigs(domain: string): Configs<RecordConfig> {
    const serverConfigs = this.getRecordConfigsFromServers(domain)
    const domainConfigs = this.getRecordConfigsFromDomains(domain)
    return serverConfigs.merge(domainConfigs)
  }

  public getDomainConfig(domain: string) {
    let result = new DomainConfig(domain, this.getServerType(domain))
    if (this.domains !== undefined) {
      result = this.domains.getConfig(domain, result) || result
      result.records = this.getRecordConfigs(domain)
    }
    result.name = domain
    return result
  }

  public getServerConfig(server: string) {
    let result = new ServerConfig(server)
    if (this.servers !== undefined) {
      result = this.servers.getConfig(server, result) || result
    }
    return result
  }

  public getServerType(domain: string) {
    let defaultName = "unknown"
    if (this.servers) {
      for (const server of this.servers.values()) {
        const filters = server.filters
        if (filters) {
          for (const filter of filters) {
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

  private resolveRecords(records: Configs<RecordConfig>, domain: string) {
    const result = new Configs<RecordConfig>()
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
    return result
  }

  private getRecordConfigsFromServers(domain: string) {
    let result = new Configs<RecordConfig>()
    const serverType = this.getServerType(domain)
    const serverConfig = this.servers.getConfig(serverType, new ServerConfig(serverType))
    if (serverConfig) {
      result = this.resolveRecords(serverConfig.records, domain)
    }
    return result
  }

  private getRecordConfigsFromDomains(domain: string) {
    let result = new Configs<RecordConfig>()
    const serverType = this.getServerType(domain)
    const domainConfig = this.domains.getConfig(domain, new DomainConfig(domain, serverType))
    if (domainConfig) {
      result = this.resolveRecords(domainConfig.records, domain)
    }
    return result
  }
}
