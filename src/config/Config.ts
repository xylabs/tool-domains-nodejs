import chalk from 'chalk'
import merge from 'lodash/merge'

import { DnslintSchemaJson, Domain, Record, Server, Source } from '../schema'

export class Config implements DnslintSchemaJson {
  $schema?: string
  additionalProperties?: false
  aws?: Source
  domains?: Domain[]
  servers?: Server[]

  constructor(json: DnslintSchemaJson) {
    this.$schema = json.$schema
    this.additionalProperties = json.additionalProperties
    this.aws = json.aws
    this.domains = json.domains
    this.servers = json.servers
  }

  public getRecordConfig(domain: string, recordType: string, verbose: boolean) {
    const serverType = this.getServerType(domain, verbose)
    let serverRecord: Record | undefined = undefined
    let domainRecord: Record | undefined = undefined

    const serverConfig =
      this.servers?.find(({ name }) => name === serverType) ?? this.servers?.find(({ name }) => name === '*')
    if (serverConfig && serverConfig.records) {
      serverRecord =
        serverConfig.records.find((record) => record.type === recordType) ??
        serverConfig.records.find((record) => record.type === '*')
    }

    const domainConfig =
      this.domains?.find(({ name }) => name === domain) ?? this.domains?.find(({ name }) => name === '*')
    if (domainConfig && domainConfig.records) {
      domainRecord =
        domainConfig.records.find((record) => record.type === recordType) ??
        domainConfig.records.find((record) => record.type === '*')
    }

    return merge({}, serverRecord, domainRecord)
  }

  public getDomainConfig(domain: string): Domain {
    return merge(
      {},
      this.domains?.find(({ name }) => name === domain) ?? this.domains?.find(({ name }) => name === '*'),
      { name: domain }
    )
  }

  public getServerType(domain: string, verbose: boolean) {
    const defaultName = 'unknown'
    if (this.servers) {
      for (const server of this.servers.values()) {
        const { filter } = server
        if (filter) {
          for (const item of filter) {
            if (domain.match(item) || item === '*') {
              verbose ?? console.log(chalk.magenta(`ServerType: ${domain}:${server.name}`))
              return server.name
            }
          }
        }
      }
    }
    verbose ?? console.log(chalk.magenta(`ServerType[Default]: ${domain}:${defaultName}`))
    return defaultName
  }
}
