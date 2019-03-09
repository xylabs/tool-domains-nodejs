import { RecordValidator } from './base'
import { DNS } from '../../dns'

export class RecordValidatorA extends RecordValidator {
  public addresses?: any
  public http?: any
  public https?: any
  public reverseDns?: any

  public async validate(config: object): Promise<RecordValidatorA> {
    this.addresses = await DNS.lookup(this.name)
    this.http = await this.getHttpResponse()
    this.https = await this.getHttpResponse(true)
    this.reverseDns = await DNS.reverse(this.addresses)
    return this
  }
}
