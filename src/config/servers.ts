import { ServerConfig } from "./server"
import { RecordsConfig } from "./records"

export class ServersConfig extends Array <ServerConfig> {

  public concat(servers: ServerConfig[]): ServersConfig {
    for (const server of servers) {
      const serverConfig = Object.assign(new ServerConfig(server.name), server)
      this.push(serverConfig)
    }
    return this
  }

  public getConfig(serverType: string): ServerConfig {
    const result = new ServerConfig(serverType)
    const map = this.getMap()
    Object.assign(result, map.get("default"))
    Object.assign(result, map.get(serverType))
    result.name = serverType

    // make sure it is a full object
    const records = new RecordsConfig()
    Object.assign(records, result.records)
    result.records = records
    return result
  }

  public getMap() {
    const map = new Map<string, ServerConfig>()
    for (const server of this) {
      map.set(server.name, server)
    }
    return map
  }
}
