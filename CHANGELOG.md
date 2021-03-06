## Release History

All notable changes to this project will be documented here.

##### [Unreleased][unreleased]

### 0.4.11 - 2015-11-26

__Changed:__

* add `remove`, `length` and `clear` methods to Storage class
* update unit test

### 0.4.10 - 2015-10-10

__Changed:__

* fix scope in logger print method
* set `utils/storage` as a service provider
* fix `getFile` method path && remove useless error message
* clean options
* add logger engine to basic logs
* update unit test

### 0.4.9 - 2015-10-07

__Changed:__

* fix `utils/logger` illegal invocation


### 0.4.8 - 2015-10-07

__Changed:__

* `utils/storage` and `utils/logger` works are service provider now.
* Move `lib/storage/memory.js` to `lib/abstracts/storage.js`
* Remove first argument from `Core.log()`
* Move `winston.js` from dependencies to dev-dependencies


__Added:__

* `lib/abstracts/logger` as default log service.

### 0.4.7 - 2015-10-05

__Changed:__

* Logger as external dependency


### 0.4.6 - 2015-10-05

__Changed:__

* Update default config file path
* update README.md and CHANGELOG.md


### 0.4.5 - 2015-09-30

__Changed:__

* update unit test
* update README.md and CHANGELOG.md

### 0.4.4 - 2015-09-30

__Changed:__

* Implement new Squid Config class

### 0.4.3 - 2015-09-29

__Changed:__

* Move back Core _version variable
* Make Logger optional
* Default config file path is an option, `configPath` (TODO: find better name)

### 0.4.2 - 2015-09-28

__Changed:__

* Resolve package.json path in desktop

### 0.4.1 - 2015-09-28

__Changed:__

* split actions and stores classes into distincts files
* fix Core Alias typo


### 0.4.0 - 2015-09-25

__Added:__

* Create `services` folders for data provider like Gihub or Parse
* Create `github.js` service, partial unit test
* Create `repositories` and `issues` stores files
* Create `issues` and `comments` collection files
* Add `Error` log to transport config


__Changed:__

* Update Logger API with formated messages ALA `sprintf`
* Rename User credentials to `_GHTOKENKEYNAME` as it refer to Github token
* Rename Github credentials keys to be consistent with GH API.
* Add `bluebird@2.10.0` to dependencies (promise library)
* Rename `isLogin` method to `isLogged`
* `isLogged` return promise
* Update `.gitignore` file
* Update unit test

__Remove:__

* `utils/service.js`, remplaced by `services/github.js`


### 0.3.1 - 2015-09-13

__Changed:__

* get core _VERSION from `package.json`
* Move Logger setup to `utils/logger.js`
* Move Release History to `CHANGELOG.md` file

### 0.3.0 - 2015-09-10

__Added:__

* Add `winston@1.0.1` to dependencies
* Setup logger

### 0.2.0 - 2015-09-08

__Added:__

* Storage classes
* User Credentials manager
* Add `squid-config@0.1.0` to dependencies
* Add `node-fetch@1.3.2` to dependencies
* Application client ID/secret configuration file

__Changed:__

* Change `core` access API
* Configuration management is delegated  to `squid-config`
* Update Unit Test
* Update `README.md`
* Remove useless `devDependencies` from `package.js`

__Remove:__

* Remove `config-manager` module
* Remove `Xhr` class

### 0.1.0 - 2015-09-03

__Added:__

* Package folders structure
* Core Classes
* Base unit test
* README and LICENSE files
