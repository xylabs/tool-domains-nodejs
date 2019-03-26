import { AWS } from './aws'
import fs from 'fs'
import { MasterConfig } from './config'
import chalk from 'chalk'
import { DomainValidator } from './validator'
import { DomainConfig } from './config/domain'
import { Configs } from './config/configs'
import { MasterValidator } from './validator/master'
import { AWSConfig } from './config/aws'
import defaultConfigJson from './config/default.json'
import loadJsonFile from 'load-json-file'

export class XyDomainScan {

  private aws = new AWS()
  private config = new MasterConfig("master")
  private validator = new MasterValidator(new MasterConfig("master"))

  public async loadConfig(filename?: string) {
    try {
      const filenameToLoad = filename || './dnslint.json'
      /*const ajv = new Ajv({ schemaId: 'id' })
      const validate = ajv.compile(schema)
      if (!validate(defaultConfig)) {
        console.error(chalk.red(`${validate.errors}`))
      } else {
        console.log(chalk.green("Default Config Validated"))
      }*/
      const defaultConfig = MasterConfig.parse(defaultConfigJson)
      console.log(chalk.gray("Loaded Default Config"))
      try {
        const userConfigJson = await loadJsonFile(filenameToLoad)
        const userConfig = MasterConfig.parse(userConfigJson)
        /*if (!validate(userJson)) {
          console.error(chalk.red(`${validate.errors}`))
        } else {
          console.log(chalk.green("User Config Validated"))
        }*/
        console.log(chalk.gray("Loaded User Config"))
        const result = defaultConfig.merge(userConfig)
        return result
      } catch (ex) {
        console.log(chalk.yellow(`No dnslint.json config file found.  Using defaults: ${ex.message}`))
        console.error(ex.stack)
        return defaultConfig
      }
    } catch (ex) {
      console.log(chalk.red(`Failed to load defaults: ${ex}`))
      console.error(ex.stack)
      return new MasterConfig("master")
    }
  }

  public async start(params: {output: string, singleDomain?: string, bucket?: string, config?: MasterConfig}) {
    this.config = await this.loadConfig()

    for (const domain of this.config.domains.values()) {
      domain.serverType = this.config.getServerType(domain.name)
    }

    // if domain specified, clear configed domains and add it
    if (params.singleDomain) {
      console.log(chalk.yellow(`Configuring Single Domain: ${params.singleDomain}`))
      const singleDomainConfig = this.config.getDomainConfig(params.singleDomain)
      this.config.domains.set(
        singleDomainConfig.name,
        singleDomainConfig
      )

      // since we are only doing one, remove the rest
      for (const domain of this.config.domains.values()) {
        if (domain.name !== "default" && domain.name !== params.singleDomain) {
          this.config.domains.delete(domain.key)
        }
      }

      this.config.aws = new AWSConfig("aws")
      this.config.aws.enabled = false
    }

    this.validator = new MasterValidator(this.config)

    console.log(`Domains Found: ${this.config.domains.size}`)

    await this.validator.validate()

    if (params.bucket) {
      this.saveToAws(params.bucket)
    }

    console.log(`Saving to File: ${params.output}`)
    this.saveToFile(params.output)
    if (this.validator.errorCount === 0) {
      console.log(chalk.green("Congratulations, all tests passed!"))
    } else {
      console.error(chalk.yellow(`Total Errors Found: ${this.validator.errorCount}`))
    }
    return this.validator
  }

  private getLatestS3FileName() {
    return `latest.json`
  }

  private getHistoricS3FileName() {
    const date = new Date().toISOString()
    const parts = date.split('T')
    return `${parts[0]}/${parts[1]}.json`
  }

  private async saveToAws(bucket: string) {
    try {
      await this.aws.saveFileToS3(bucket, this.getLatestS3FileName(), this.validator)
      await this.aws.saveFileToS3(bucket, this.getHistoricS3FileName(), this.validator)
    } catch (ex) {
      console.error(chalk.red(ex.message))
      console.error(chalk.red(ex.stack))
    }
  }

  private async saveToFile(filename: string) {
    fs.open(filename, 'w', (err, fd) => {
      if (err) {
        console.log(`failed to open file: ${err}`)
      } else {
        fs.write(fd, JSON.stringify(this.validator), (errWrite) => {
          if (errWrite) {
            console.log(`failed to write file: ${errWrite}`)
          }
        })
      }
    })
  }
}
