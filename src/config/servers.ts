import { ServerConfig } from "./server"
import { RecordsConfig } from "./records"
import { RecordConfig } from "./record"
import _ from "lodash"

export class ServersConfig extends Array <ServerConfig> {

  private mapCache?: Map<string, ServerConfig>

  public concat(servers: ServerConfig[]): ServersConfig {
    for (const server of servers) {
      const serverConfig = Object.assign(new ServerConfig(server.name), server)
      this.push(serverConfig)
    }
    return this
  }

  public merge(items: any[]) {
    const map = this.getMap()
    this.mapCache = undefined
    for (const item of items) {
      const newItem = map.get(item.name) || new ServerConfig(item.name)
      map.set(item.name, newItem.merge(item))
    }
    const result = new ServersConfig()
    for (const item of map) {
      result.push(item[1])
    }
    return result
  }

  public getConfig(serverType: string): ServerConfig {
    let result = new ServerConfig(serverType)
    const map = this.getMap()
    result = _.merge(result, map.get("default"))
    result = _.merge(result, map.get(serverType))

    // make sure it is a full object
    let records = new RecordsConfig()
    records = _.merge(records, result.records)
    result.records = records
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
    this.mapCache = new Map<string, ServerConfig>()
    for (const domain of this) {
      this.mapCache.set(domain.name, domain)
    }
    return this.mapCache
  }
}
