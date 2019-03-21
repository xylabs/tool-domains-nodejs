[logo]: https://www.xy.company/img/home/logo_xy.png

![logo]

# DNSLint (tool-domains-nodejs)

[![npm version](https://badge.fury.io/js/dnslint.svg)](https://badge.fury.io/js/dnslint) [![Build Status](https://travis-ci.com/XYOracleNetwork/tool-domains-nodejs.svg?token=A85R2pDnngMDyWoqeLUG&branch=master)](https://travis-ci.com/XYOracleNetwork/tool-domains-nodejs) [![Maintainability](https://api.codeclimate.com/v1/badges/7b4591ab55a5c83f0a86/maintainability)](https://codeclimate.com/repos/5c74a1ecac0eba026f00a686/maintainability)

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
dnslint start
```

This will scan your entire AWS Route53 and output results in output.json

### CLI options

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

Only for internal XY Company use at this time

## Credits

Made with ❤️
by [XYO](https://xyo.network)