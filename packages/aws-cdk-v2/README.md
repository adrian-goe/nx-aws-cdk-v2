[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![@ago-dev/nx-aws-cdk-v2](https://img.shields.io/badge/%40adrian--goe-nx--aws--cdk-green)](https://github.com/adrian-goe/nx-aws-cdk-v2/tree/main/packages/aws-cdk-v2)
[![Typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://www.typescriptlang.org/)
[![LICENSE](https://img.shields.io/npm/l/@ago-dev/nx-aws-cdk-v2.svg)](https://www.npmjs.com/package/@ago-dev/nx-aws-cdk-v2)
[![npm version](https://img.shields.io/npm/v/@ago-dev/nx-aws-cdk-v2.svg)](https://www.npmjs.com/package/@ago-dev/nx-aws-cdk-v2)
[![Downloads](https://img.shields.io/npm/dm/@ago-dev/nx-aws-cdk-v2.svg)](https://www.npmjs.com/package/@ago-dev/nx-aws-cdk-v2)

<hr>

# @ago-dev/nx-aws-cdk-v2

An Nx plugin for developing [aws-cdk](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Generate Application](#generate-application)
  - [Targets](#targets)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Install

```shell
# npm
npm install --save-dev @ago-dev/nx-aws-cdk-v2

# yarn
yarn add --dev @ago-dev/nx-aws-cdk-v2
```

## Usage

### Generate Application

Create AWS CDK v2 Application

More details on AWS CDK v2 can be found on https://docs.aws.amazon.com/cdk/v2/guide/home.html

```shell
nx generate @ago-dev/nx-aws-cdk-v2:application myApp
```

you can customize it further by passing these options:

```
nx generate @ago-dev/nx-aws-cdk-v2:application [name] [options,...]

Options:
  --name
  --tags                     Add tags to the project (used for linting)
  --directory                A directory where the project is placed
  --skipFormat               Skip formatting files
  --unitTestRunner           Adds the specified unit test runner (default: jest)
  --linter                   The tool to use for running lint checks. (default: eslint)
  --setParserOptionsProject  Whether or not to configure the ESLint "parserOptions.project" option. We do not do this by default for lint performance reasons.
  --dryRun                   Runs through and reports activity without writing to disk.
  --skip-nx-cache            Skip the use of Nx cache.
  --help                     Show available options for project target.
```

### Targets

Generated applications expose several functions to the CLI that allow users to deploy, destroy and bootstrap.

```shell
nx deploy myApp
nx destroy myApp
nx bootstrap --profile=profile
#see how to use aws environments https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html#bootstrapping-howto-cli
nx bootstrap aws://123456789012/us-east-1
```

## Maintainers

[@adrian-goe](https://github.com/adrian-goe)

## Contributing

See [the contributing file](../../CONTRIBUTING.md)!

PRs accepted.

If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

This project is MIT licensed 2022 Adrian Görisch

## Special thanks

This Project is based on [@tienne](https://github.com/tienne)'s
[nx-plugins](https://github.com/codebrewlab/nx-plugins).

Also thanks to [@therk](https://github.com/therk) for his work on migrating to cdk v2.
