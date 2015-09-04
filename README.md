SQUID Core
===========

Device agnostic shared code.

## Contains

* Default JSON config files
* Backbone's Models
* Backbone's Collections
* Reflux Actions
* Reflux Stores
* Utils classes
	* XHR Library
	* Github API services wrapper
	* Config manager

## Usage examples

	// Core instance
	var SquidCore = require('squid-core').setConfig({
	  config: { env: 'prod' }
	})

	SquidCore._VERSION // return '0.1.0'

	SquidCore
      .getConfig('github.pagination.repositories') // return '50'

	var username = 'michael'
	  , model    = require('squid-core').model('user')
	  , user     = new model({ name: username })

	user.get('name') // return 'michael'


## Tests

    npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial commit
