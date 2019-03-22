import commander from 'commander'
import dotenvExpand from 'dotenv-expand'
import { XyDomainScan } from './'
import { inspect } from 'util'
import { Config } from './config'

const getVersion = (): string => {
  dotenvExpand({
    parsed: {
      APP_VERSION:'$npm_package_version',
      APP_NAME:'$npm_package_name'
    }
  })

  return process.env.APP_VERSION || 'Unknown'
}

const start = async (output: string, domain?: string) => {
  const tool = new XyDomainScan()
  const result = await tool.start(output, domain)
  console.log("==== Finished ====")
  return result
}

const program = commander

program
  .version(getVersion())
  .option("-o, --output [value]", "Output file path", "dnslint-report.json")
  .option("-d, --domainToCheck [value]", "Domain to Check")

program.parse(process.argv)

console.log(inspect(program))

start(program.output, program.domainToCheck)
