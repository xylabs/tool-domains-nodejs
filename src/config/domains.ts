import { DomainConfig } from "./domain"

export class DomainsConfig extends Array<DomainConfig> {

  private mapCache?: Map<string, DomainConfig>

  public concat(domains: DomainConfig[]): DomainsConfig {
    for (const domain of domains) {
      const domainConfig = Object.assign(new DomainConfig(domain.name), domain)
      this.push(domainConfig)
    }
    return this
  }

  public getConfig(domain: string, serverType?: string): DomainConfig {
    const result = new DomainConfig(domain)
    const map = this.getMap()
    Object.assign(result, map.get("default"))
    Object.assign(result, map.get(domain))
    result.name = domain
    return result
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
