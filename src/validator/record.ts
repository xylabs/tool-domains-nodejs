import chalk from 'chalk'
import { RecordType } from 'dns-packet'

import { Dns } from '../dns'
import { Record } from '../schema'
import { Validator } from './validator'
import { ValueValidator } from './value'
import { WebcallValidator } from './Webcall'

export class RecordValidator extends Validator<Record> {
  public type?: RecordType

  public domain: string

  public inheritable: boolean

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public records: any[] = []

  public webcalls: WebcallValidator[] = []

  public values: ValueValidator[] = []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public reverseDns?: any

  constructor(config: Record, domain: string) {
    super(config)
    this.domain = domain
    this.type = config.type as RecordType
    this.inheritable = config.inheritable ?? false
  }

  public async validate(verbose: boolean) {
    if (this.type?.split('|').length === 1) {
      await this.resolve()
      this.webcalls = await this.validateWebcalls(verbose)
      this.values = await this.validateValues(verbose)
      /*if (this.config.reverseDNS) {
        if ((this.config.reverseDNS.enabled === undefined && true) || this.config.reverseDNS.enabled) {
          this.reverseDns = await this.reverseLookup(this.config.reverseDNS.value)
        }
      }*/
    }
    return super.validate(verbose)
  }

  protected async validateWebcalls(verbose: boolean) {
    const result: WebcallValidator[] = []
    if (this.config.webcalls) {
      for (const webcall of this.config.webcalls.values()) {
        for (const record of this.records) {
          if (record.data) {
            const validator = new WebcallValidator(webcall, record.data, this.domain)
            result.push(validator)
            await validator.validate(verbose)
            this.errorCount += validator.errorCount
          }
        }
      }
    }
    return result
  }

  protected async validateValues(verbose: boolean) {
    let valueErrorCount = 0
    const result: ValueValidator[] = []
    if (this.config.values) {
      for (const values of this.config.values.values()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataArray: any[] = []
        for (const record of this.records) {
          if (record.data) {
            if (Array.isArray(record.data)) {
              for (const innerRecord of record.data) {
                // eslint-disable-next-line max-depth
                if (Buffer.isBuffer(innerRecord)) {
                  dataArray.push(innerRecord.toString())
                }
              }
            } else {
              dataArray.push(record.data)
            }
          }
        }
        const validator = new ValueValidator(values, dataArray, `${this.domain}:${this.type}`)
        result.push(validator)
        await validator.validate(verbose)
        this.errorCount += validator.errorCount
        valueErrorCount += validator.errorCount
      }
    }
    if (valueErrorCount === 0) {
      console.log(chalk.green('validateValues', 'Passed'))
    } else {
      console.log(chalk.red('validateValues', `Errors: ${valueErrorCount}`))
    }
    return result
  }

  protected async reverseLookup(value?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any[] = []
    try {
      for (const record of this.records) {
        if (record.data) {
          let domains: string[] | undefined
          let valid = true
          try {
            domains = await Dns.reverse(record.data)
          } catch (ex) {
            const error = ex as Error
            this.addError('reverse', error.message)
            valid = false
          }
          if (value && domains) {
            for (const domain of domains) {
              if (!domain.match(value)) {
                valid = false
                this.addError('reverse', `Unexpected Domain: ${domain} [Expected: ${value}]`)
              }
            }
          }
          result.push({
            domains,
            ip: record,
            valid,
          })
        }
      }
    } catch (ex) {
      const error = ex as Error
      this.addError('RecordValidator.reverseLookup', error.message)
      console.error(chalk.red(error.stack))
    }
    return result
  }

  private async resolve() {
    this.records = []
    try {
      if (!this.type) {
        this.addError('resolve', 'Missing Type')
        return
      }
      if (!this.domain) {
        this.addError('resolve', 'Missing Domain')
        return
      }
      let { domain } = this
      this.records = await Dns.resolve(domain, this.type)
      if (this.inheritable) {
        while (this.records.length === 0 && domain.includes('.')) {
          const parts = domain.split('.')
          domain = parts.slice(1).join('.')
          this.records = await Dns.resolve(domain, this.type)
        }
      }
    } catch (ex) {
      const error = ex as Error
      this.addError('resolve', error.message)
      console.error(chalk.red(error.stack))
    }
  }
}
