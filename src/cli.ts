import commander from 'commander'
import dotenvExpand from 'dotenv-expand'
import { XyDomainScan } from "."

const getVersion = (): string => {
  dotenvExpand({
    parsed: {
      APP_VERSION: '$npm_package_version',
      APP_NAME: '$npm_package_name',
    },
  })

  return process.env.APP_VERSION || 'Unknown'
}

const program = commander

program
  .version(getVersion())
  .option('-c, --defaultConfig [value]', 'default config file path', './config/default.json')
  .option('-o, --output [value]', 'output file path', 'dnslint-report.json')
  .option('-v, --verbose [value]', 'verbose output', 'true')
  .option('-p, --preflight [value]', 'generates preflight report')
  .option('-d, --domainToCheck [value]', 'domain to check')
  .option('-b, --bucket [value]', 's3 bucket to write result to')

program.parse(process.argv)

// start
const tool = new XyDomainScan()
tool.start(
  {
    defaultConfig: program.defaultConfig,
    verbose: (program.verbose === 'true'),
    output: program.output,
    singleDomain: program.domainToCheck,
    bucket: program.bucket,
    preflight: program.preflight,
  },
)
