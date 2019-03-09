import { RecordValidator } from './base'
import { DNS } from '../../dns'
import { Config } from '../../config'

export class RecordValidatorCNAME extends RecordValidator {
  public addresses?: any
  public http?: any
  public https?: any
  public reverseDns?: any

  constructor(name: string, config: Config) {
    super(name, "CNAME", config)
  }

  public async validate(): Promise<RecordValidatorCNAME> {
    this.addresses = await DNS.lookup(this.name)
    this.http = await this.getHttpResponse()
    this.https = await this.getHttpResponse(true)
    this.reverseDns = await DNS.reverse(this.addresses)
    return this
  }
}
