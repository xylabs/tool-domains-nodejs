import { Validator } from './validator'
import { Dns } from '../dns'
import chalk from 'chalk'
import { RecordConfig } from '../config/record'
import { WebcallValidator } from './webcall'
import { ValueValidator } from './value'
import assert from 'assert'

export class RecordValidator extends Validator<RecordConfig> {

  public type: string
  public domain: string
  public inheritable: boolean
  public records: any[] = []
  public webcalls: WebcallValidator[] = []
  public values: ValueValidator[] = []
  public reverseDns?: any

  constructor(config: RecordConfig, domain: string) {
    super(config)
    this.domain = domain
    this.type = config.type
    this.inheritable = config.inheritable ?? false
  }

  public async validate(verbose: boolean) {
    if (this.type.split('|').length === 1) {
      await this.resolve()
      this.webcalls = await this.validateWebcalls(verbose)
      this.values = await this.validateValues(verbose)
      if (this.config.reverseDNS) {
        if (((this.config.reverseDNS.enabled === undefined) && true) || this.config.reverseDNS.enabled) {
          this.reverseDns = await this.reverseLookup(this.config.reverseDNS.value)
        }
      }
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
        const dataArray: any[] = []
        for (const record of this.records) {
          if (record.data) {
            if (Array.isArray(record.data)) {
              for (const innerRecord of record.data) {
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

  protected async reverseLookup(value ?: string) {
    const result: any[] = []
    try {
      for (const record of this.records) {
        if (record.data) {
          let domains: string[] | undefined
          let valid = true
          try {
            domains = await Dns.reverse(record.data)
          } catch (ex) {
            this.addError('reverse', ex.message)
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
            valid,
            ip: record
          })
        }
      }
    } catch (ex) {
      this.addError('RecordValidator.reverseLookup', ex.message)
      console.error(chalk.red(ex.stack))
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
      let domain = this.domain
      this.records = await Dns.resolve(domain, this.type)
      if (this.inheritable) {
        while (this.records.length === 0 && domain.includes('.')) {
          const parts = domain.split('.')
          domain = parts.slice(1).join('.')
          this.records = await Dns.resolve(domain, this.type)
        }
      }
    } catch (ex) {
      this.addError('resolve', ex.message)
      console.error(chalk.red(ex.stack))
    }
  }

}
