import { DomainConfig } from "./domain"
import { RecordConfig } from "./record"
import _ from "lodash"

export class DomainsConfig extends Array<DomainConfig> {

  private mapCache?: Map<string, DomainConfig>

  public merge(items: any[]) {
    const map = this.getMap()
    this.mapCache = undefined
    for (const item of items) {
      const newItem = map.get(item.name) || new DomainConfig(item.name)
      map.set(item.name, newItem.merge(item))
    }
    const result = new DomainsConfig()
    for (const item of map) {
      result.push(item[1])
    }
    return result
  }

  public concat(domains: DomainConfig[]): DomainsConfig {
    for (const domain of domains) {
      const domainConfig = Object.assign(new DomainConfig(domain.name), domain)
      this.push(domainConfig)
    }
    return this
  }

  public getConfig(domain: string): DomainConfig {
    const map = this.getMap()
    let result = new DomainConfig(domain)
    result = result.merge(map.get("default"))
    result = result.merge(map.get(domain))
    return result
  }

  public getRecordConfig(serverType: string, recordType: string) {
    let defaultRecordConfig = new RecordConfig(recordType)
    let serverRecordConfig = new RecordConfig(recordType)
    const defaultConfig = this.getConfig("default")
    const serverConfig = this.getConfig(serverType)
    if (defaultConfig && defaultConfig.records) {
      defaultRecordConfig = defaultConfig.records.getConfig(recordType)
    }
    if (serverConfig && serverConfig.records) {
      serverRecordConfig = serverConfig.records.getConfig(recordType)
    }
    return _.merge(defaultRecordConfig, serverRecordConfig)
  }

  public getMap() {
    if (this.mapCache) {
      return this.mapCache
    }
    this.mapCache = new Map<string, DomainConfig>()
    for (const domain of this) {
      this.mapCache.set(domain.name, domain)
    }
    return this.mapCache
  }
}
