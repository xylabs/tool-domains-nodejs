import program from 'commander'
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

const start = async (domain?: string) => {
  const tool = new XyDomainScan()
  const result = await tool.start(domain)
  console.log("==== Finished ====")
  return result
}

program
  .version(getVersion())

program
  .command('start')
  .description('Start the Scanner (Default)')
  .action(start)

program
  .command('config <provider>')
  .description('Configure a part of the system')
  .action((provider) => {
    console.log(provider)
    return 0
  })

program.parse(process.argv)

// if no args, then default to start
switch (program.args.length) {
  case 0:
    start()
    break
  case 1:
    start(program.args[0])
    break
}
