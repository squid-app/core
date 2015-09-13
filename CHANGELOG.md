## Release History

All notable changes to this project will be documented here.

##### [Unreleased][unreleased]
* none

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