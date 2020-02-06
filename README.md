[logo]: https://cdn.xy.company/img/brand/XY_Logo_GitHub.png

# [![logo]](https://xy.company)

# DNSLint (tool-domains-nodejs)

[![NPM](https://nodei.co/npm/dnslint.png)](https://nodei.co/npm/dnslint/)

[![npm version](https://badge.fury.io/js/dnslint.svg)](https://badge.fury.io/js/dnslint) [![Build Status](https://travis-ci.com/XYOracleNetwork/tool-domains-nodejs.svg?token=A85R2pDnngMDyWoqeLUG&branch=master)](https://travis-ci.com/XYOracleNetwork/tool-domains-nodejs) [![DepShield Badge](https://depshield.sonatype.org/badges/XYOracleNetwork/tool-domains-nodejs/depshield.svg)](https://depshield.github.io) ![npm](https://img.shields.io/npm/dt/dnslint.svg)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6fecaa016b2a4f3da64cee1b680085c1)](https://app.codacy.com/app/arietrouw/tool-domains-nodejs?utm_source=github.com&utm_medium=referral&utm_content=XYOracleNetwork/tool-domains-nodejs&utm_campaign=Badge_Grade_Dashboard) [![Maintainability](https://api.codeclimate.com/v1/badges/7b4591ab55a5c83f0a86/maintainability)](https://codeclimate.com/repos/5c74a1ecac0eba026f00a686/maintainability) [![BCH compliance](https://bettercodehub.com/edge/badge/XYOracleNetwork/tool-domains-nodejs?branch=master)](https://bettercodehub.com/results/XYOracleNetwork/tool-domains-nodejs)

## Table of Contents

- [Title](#dnslint-tool-domains-nodejs)
- [Description](#description)
- [Getting Started](#getting-started)
- [CLI Options](#cli-options)
- [Config File](#config-file)
- [AWS Support](#aws-support)
- [Developer Guide](#developer-guide)
- [License](#license)
- [Credits](#credits)

## Description

Internal XY tool for checking domain configurations in AWS

## Getting started

```sh
# install globally
npm install -g dnslint
```

This will expose a cli named `dnslint` to launch the tool.

Note: Make sure you have your AWS credatials configured

```sh
# Start check
dnslint
```

This will scan your entire AWS Route53 and output results in output.json

## CLI options

```sh
Options:
  -V, --version                output the version number
  -o, --output [value]         Output file path (default: "dnslint-report.json")
  -d, --domainToCheck [value]  Domain to Check
  -h, --help                   output usage information
```

## Other Scanning Sites

[Apple Search Validator](https://search.developer.apple.com/appsearch-validation-tool)

[SecurityHeaders](https://securityheaders.com)

[MX Toolbax Super Tool](https://mxtoolbox.com/SuperTool.aspx)

## Config File [dnslint.json]

Make sure you put the config file in the same folder from where you are running the tool.

```json
{
  "$schema": "https://raw.githubusercontent.com/XYOracleNetwork/tool-domains-nodejs/master/dist/schema/dnslint.schema.json#",
  "aws": {
    "enabled": true
  },
  "domains": [
    {
      "name": "*",
      "reverseDNS": {
        "enabled": false
      },
      "records": [
        {
          "type": "*",
          "html": true
        }
      ]
    },
    {
      "name": "xy.company",
      "enabled": true
    }
  ]
}
```

## AWS Support

When aws=true is set in the dnslint.json file, then dnslint will read a list of domains from Route53, using the credentials configured in the AWS CLI

## Developer Guide

### Install dependencies

This project uses `yarn` as a package manager

```sh
  # install dependencies
  yarn install
```

Developers should conform to git flow workflow. Additionally, we should try to make sure
every commit builds. Commit messages should be meaningful serve as a meta history for the
repository. Please squash meaningless commits before submitting a pull-request.

There is git hook on commits to validate the project builds. If you'd like to commit your changes
while developing locally and want to skip this step you can use the `--no-verify` commit option.

i.e.

```sh
  git commit --no-verify -m "COMMIT MSG"
```

## License

See the [LICENSE.md](LICENSE) file for license details.

## Credits

Made with 🔥and ❄️ by [XY - The Persistent Company](https://www.xy.company)
