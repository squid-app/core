SQUID Core
===========

Device agnostic shared code for OSX and IOS.

#### Package include

* Configuration files based on environment
* Unit tests
* Backbone's Models
* Backbone's Collections
* Reflux Actions
* Reflux Stores
* Utils:
	* Github API services wrapper
	* Logger class
	* Storage abstraction class

#### Dependencies

Squid is build on top of cool open source projects such as:

* [React.js](https://facebook.github.io/react/)
* [Reflux](https://github.com/reflux/refluxjs)
* [Lodash](https://lodash.com/)
* [Backbone](http://backbonejs.org/)
* [Winston](https://github.com/winstonjs/winston)
* [Squid Config](https://github.com/squid-app/config)

All data are served by the [Github API](https://developer.github.com/v3/).

<hr>

#### Table of Content

* [Installation](#installation)
* [Basic usage examples](#basic-usage-examples)
* [Unit Tests](#unit-tests)
* [Contributing](#contributing)
* [Roadmap](#roadmap)
* [License](#license)
* [Release History](CHANGELOG.md)


## Installation

This package is not intended to be used as a stand alone library but you might need to install it for development purpose with the following command:

    $ npm install

#### Github app configuration

The application client ID and his secret are stored into a JSON file called `github.json` at the project's root. For obvious security reasons this file is not published. See [Unit Tests](#unit-tests)' section for more details about file content.

## Basic usage examples

	// New Squid Core instance
	var SquidCore = require('squid-core')

	// Setup instance with custon settings
    SquidCore.setup({
        locale:   {
            logger: false
          , github: {
              credentials: {
                  client_id:     GITHUB.client_id
                , client_secret: GITHUB.client_secret
              }
            }
        }
      , envName: 'test'
    })

	SquidCore._VERSION // return '0.4.0'

	// Get config value
	SquidCore
      .getConfig('github.pagination') // return '50'

	// New User model
	var username = 'michael'
	  , model    = SquidCore.model('user')
	  , user     = new model({ name: username })

	user.get('name') // return 'michael'

## Unit Tests

First you need to add the [`./github.json`](#github-app-configuration) to the package root with the following content:

	{
	  "client_id":     "xxxx",
	  "client_secret": "xxxx"
	  "username":      "a-valid-gitub-username",
	  "password":      "a-valid-gitub-password",
	  "token":         "a-valid-oauth-token-or-false"
	}

Then run the following command to perform unit tests:

    $ npm test

## Roadmap

See the [roadmap](https://github.com/squid-app/core/milestones) future developments.

## License

Squid is [MIT licensed](./LICENSE)

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.
