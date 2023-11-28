dbdocs
======



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dbdocs.svg)](https://npmjs.org/package/dbdocs)
[![Downloads/week](https://img.shields.io/npm/dw/dbdocs.svg)](https://npmjs.org/package/dbdocs)
[![License](https://img.shields.io/npm/l/dbdocs.svg)](https://github.com/holistics/dbdocs/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g dbdocs
$ dbdocs COMMAND
running command...
$ dbdocs (-v|--version|version)
dbdocs/0.6.2 darwin-x64 node-v15.10.0
$ dbdocs --help [COMMAND]
USAGE
  $ dbdocs COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dbdocs build [FILEPATH]`](#dbdocs-build-filepath)
* [`dbdocs help [COMMAND]`](#dbdocs-help-command)
* [`dbdocs login`](#dbdocs-login)
* [`dbdocs logout`](#dbdocs-logout)
* [`dbdocs ls`](#dbdocs-ls)
* [`dbdocs password`](#dbdocs-password)
* [`dbdocs remove [PROJECT_NAME]`](#dbdocs-remove-project_name)
* [`dbdocs rename`](#dbdocs-rename)
* [`dbdocs token`](#dbdocs-token)
* [`dbdocs validate [FILEPATH]`](#dbdocs-validate-filepath)

## `dbdocs build [FILEPATH]`

build docs

```
USAGE
  $ dbdocs build [FILEPATH]

ARGUMENTS
  FILEPATH  dbml file path

OPTIONS
  -p, --password=password  password for project
  --project=project        project name
```

## `dbdocs help [COMMAND]`

display help for dbdocs

```
USAGE
  $ dbdocs help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

## `dbdocs login`

login to dbdocs

```
USAGE
  $ dbdocs login

DESCRIPTION
  login with your dbdocs credentials
```

## `dbdocs logout`

logout

```
USAGE
  $ dbdocs logout

DESCRIPTION
  clears local login credentials
```

## `dbdocs ls`

list projects

```
USAGE
  $ dbdocs ls

DESCRIPTION
  list all projects in your default organization
```

## `dbdocs password`

set password for your project or remove password

```
USAGE
  $ dbdocs password

OPTIONS
  -p, --project=project name  project name
  -r, --remove                remove password from your project
  -s, --set=password          password for your project
```

## `dbdocs remove [PROJECT_NAME]`

remove project

```
USAGE
  $ dbdocs remove [PROJECT_NAME]

ARGUMENTS
  PROJECT_NAME  name of the project which you want to remove
```

## `dbdocs rename`

change your username

```
USAGE
  $ dbdocs rename

DESCRIPTION
  change your username and your default organization name
```

## `dbdocs token`

generate or revoke your authentication token

```
USAGE
  $ dbdocs token

OPTIONS
  -g, --generate  generate authentication token
  -r, --revoke    revoke authentication token
```

## `dbdocs validate [FILEPATH]`

validate docs content

```
USAGE
  $ dbdocs validate [FILEPATH]

ARGUMENTS
  FILEPATH  dbml file path
```
<!-- commandsstop -->
