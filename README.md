SQUID Core
===========

Device agnostic shared code for OSX and IOS.

#### Package include

* Default JSON config files
* Backbone's Models
* Backbone's Collections
* Reflux Actions
* Reflux Stores
* Utils classes
	* XHR Library
	* Github API services wrapper
	* Config manager
	* Storage manager

The application client ID and his secret are stored into a JSON file called `github.json` at the project's root. For obvious security reasons this file is not published. Here is a sample:

	{
	  "id":     "xxxx",
	  "secret": "xxxx"
	}

#### Dependencies

Squid is build on top of cool open source projects such as:

* [React.js](https://facebook.github.io/react/)
* [Reflux](https://github.com/reflux/refluxjs)
* [Lodash](https://lodash.com/)
* [Backbone](http://backbonejs.org/)

All the data are served by the [Github API](https://developer.github.com/v3/).

<hr>

#### Table of Content

* [Installation](#installation)
* [Usage examples](#usage-examples)
* [Unit Tests](#unit-tests)
* [Contributing](#contributing)
* [Release History](#release-history)


## Installation

This package is not intended to be used as a stand alone library but you might need to install it for development purpose with the following command:

    $ npm install

## Usage examples

	// New Squid Core instance
	var SquidCore = require('squid-core')
	
	// Setup instance with custon settings
	SquidCore.setup({
		config:  { env: 'prod' }
	  , storage: { engine: 'LocalStorage' }
	})

	SquidCore._VERSION // return '0.1.1'

	// Get config value
	SquidCore
      .getConfig('github.pagination.repositories') // return '50'

	// New User model
	var username = 'michael'
	  , model    = SquidCore.model('user')
	  , user     = new model({ name: username })

	user.get('name') // return 'michael'

## Unit Tests

Run the following command to perform unit tests:

    $ npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

All notable changes to this project will be documented here.

##### [Unreleased][unreleased]
* __Added:__
	* Storage classes
	* User Credentials manager
	* Add Promise to dependencies
	* Application client ID/secret configuration file
	
* __Changed:__
	* Change Core access API
	* Update README
	* Remove useless `devDependencies` from `package.js`

##### 0.1.0 - 2015-09-03
* __Added:__
	* Package folders structure
	* Core Classes
	* Base unit test
	* README and LICENSE files
