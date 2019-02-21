import program from 'commander'
import dotenvExpand from 'dotenv-expand'
import {XyoDomainScan} from './XyoDomainScan'

const getVersion = (): string => {
  dotenvExpand({
    parsed: {
      APP_VERSION:'$npm_package_version',
      APP_NAME:'$npm_package_name'
    }
  })

  return process.env.APP_VERSION || 'Unknown'
}

program
  .version(getVersion())
  .usage('$0 <cmd> [args]')

program
  .command('start')
  .description('Start the Scanner')
  .action(() => {
    const tool = new XyoDomainScan()
    tool.start()
  })

program.parse(process.argv)

if (process.argv.length < 3) {
  program.help()
}