import program from 'commander'
import dotenvExpand from 'dotenv-expand'
import { XyDomainScan } from './'
import { inspect } from 'util'

const getVersion = (): string => {
  dotenvExpand({
    parsed: {
      APP_VERSION:'$npm_package_version',
      APP_NAME:'$npm_package_name'
    }
  })

  return process.env.APP_VERSION || 'Unknown'
}

const start = async () => {
  const tool = new XyDomainScan()
  const result = await tool.start()
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
  .action(async(provider) => {
    console.log(provider)
    return 0
  })

program.parse(process.argv)

// if no args, then default to start
if (program.args.length < 1) {
  start()
}
