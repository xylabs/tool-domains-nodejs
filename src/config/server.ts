import { RecordsConfig } from "./records"

export class ServerConfig {
  public name: string
  public default?: boolean
  public include?: string[]
  public exclude?: string[]
  public records?: RecordsConfig

  constructor(name: string) {
    this.name = name
  }
}
