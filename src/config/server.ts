import _ from 'lodash'
import chalk from 'chalk'
import assert from 'assert'
import { Configs } from './configs'
import { RecordConfig } from './record'
import { RecordsConfig } from './records'

export class ServerConfig extends RecordsConfig {
  public static parse(source: any) {
    let srcObj = source
    if (typeof source === 'string') {
      srcObj = JSON.parse(source)
    }

    assert(typeof srcObj.name === 'string')

    let server = new ServerConfig(srcObj.name)
    server = _.merge(server, srcObj)
    server.records = new Configs<RecordConfig>()
    if (srcObj.records) {
      for (const record of srcObj.records) {
        const newRecordObj = RecordConfig.parse(record, '*')
        server.records.set(newRecordObj.type, newRecordObj)
      }
    }
    return server
  }

  public name: string

  public default?: boolean

  public filters?: string[]

  public crawl?: boolean

  constructor(name: string) {
    super(name)
    this.name = name
    this.records = new Configs<RecordConfig>()
  }

  public merge(config?: ServerConfig) {
    if (config) {
      const { name } = this
      const { records } = this
      let newItem = new ServerConfig(name)
      newItem = _.merge(newItem, this)
      newItem = _.merge(newItem, config)
      newItem.records = _.merge(records, config.records)
      newItem.name = name
      console.log(chalk.gray(`server.merge[${config.name}]: ${newItem.records}`))
      super.merge(config)
    }
    return this
  }
}
