import { Config } from "./config"

export class WebcallConfig extends Config {
  public ssl?: boolean
  public port?: number
  public timeout?: number
  public html?: boolean
  public callTimeMax?: number
}
