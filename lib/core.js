/**
 * Squid Core
 *
 */

'use strict';

var _             = require('lodash')
  , configManager = require('./utils/config')

var Squid = function( options )
{
  options = options || {}

  // APP'S Constants
  // -------------

  // Current version of the library.
  this._VERSION     = '0.1.0'

  // User credentials localStorage's item name
  this._CREDENTIALS = 'SquidUserCredentials'

  // test instance uniqueness
  this._UID         = _.uniqueId('squid_')

  // APP'S Config
  // -------------

  this._config      = new configManager( options.config || {} )

  // User's session
  // -------------

  // current user's credentials
  this._credentials = false

  // return Squid Core reference
  return this
}

// Config
//-------------------------------

// get Config item alias
//
Squid.prototype.getConfig = function( key, defaults )
{
  return this._config.get( key, defaults )
}

module.exports = Squid
