[logo]: https://www.xy.company/img/home/logo_xy.png

![logo]

# Domain Check CLI Tool (tool-domains-nodejs)

Internal XY tool for checking domain configurations in AWS

## Getting started

```sh
# install globally
npm install -g @xyo-network/tool-domains-nodejs
```

This will expose a cli named `xydomains` to launch the tool.

Note: Make sure you have your AWS credatials configured

```sh
# Start check
xydomains start
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