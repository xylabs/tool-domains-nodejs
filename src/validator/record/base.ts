import { BaseValidator } from '../base'
import { DNS } from '../../dns'
import { AnyRecord } from 'dns'
import { RecordValidatorA } from './A'

export class RecordValidator extends BaseValidator {

  public static create(name: string, record: AnyRecord) {
    switch (record.type) {
      case "A":
        return new RecordValidatorA(name)
      default:
        return new RecordValidator(name)
    }
  }

  public addresses?: any
  public http?: any
  public https?: any
  public reverseDns?: any

  public async validate(config: object): Promise<BaseValidator> {
    this.addresses = await DNS.lookup(this.name)
    this.http = await this.getHttpResponse()
    this.https = await this.getHttpResponse(true)
    this.reverseDns = await DNS.reverse(this.addresses)
    return this
  }

}
