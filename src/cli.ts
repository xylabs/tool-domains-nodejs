import { program } from 'commander'
import { expand } from 'dotenv-expand'

import { XyDomainScan } from './XyDomainScan'

export const cli = () => {
  const getVersion = (): string => {
    expand({
      parsed: {
        APP_NAME: '$npm_package_name',
        APP_VERSION: '$npm_package_version',
      },
    })

    return process.env.APP_VERSION || 'Unknown'
  }

  program
    .version(getVersion())
    .option('-c, --defaultConfig [value]', 'default config file path', './config/default.json')
    .option('-o, --output [value]', 'output file path', 'dnslint-report.json')
    .option('-v, --verbose [value]', 'verbose output', 'true')
    .option('-p, --preflight [value]', 'generates preflight report')
    .option('-d, --domainToCheck [value]', 'domain to check')
    .option('-b, --bucket [value]', 's3 bucket to write result to')

  program.parse(process.argv)

  const opts = program.opts()

  // start
  const tool = new XyDomainScan()
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  tool.start({
    bucket: opts.bucket,
    defaultConfig: opts.defaultConfig,
    output: opts.output,
    preflight: opts.preflight,
    singleDomain: opts.domainToCheck,
    verbose: opts.verbose === 'true',
  })
}
