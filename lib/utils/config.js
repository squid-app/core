/**
 * Squid Core
 *
 * Manage config across all of your environments
 *
 * https://www.npmjs.com/package/config-manager
 */

'use strict';

var _             = require('lodash')
  , configManager = require('config-manager')

// Initialize Config Class
//
//      @params  {object}  custom config properties
//      @return  {object}  Config instance
//
var Config = function( options )
{
  // CORE's settings
  // ------------------------

  var settings = _.merge({
      path: './lib/config/'
    , app:  'squid'
    , env:  'default'
  }, options || {} )

  // initialize the manager
  this._CONFIG = configManager.initSync( settings.path, settings.env, settings.app )

  return this
}


// get Config environment
//
//      @return  {string}
//
Config.prototype.targetEnv = function()
{
  return this._CONFIG.targetEnv
}

// get Config item
//
//      @params  {string}  dot notation based key's path
//      @params  {string}  default value if not found
//      @return  {void}
//
Config.prototype.get = function( path, defaults )
{
  var fields = path.split('.')
    , result = this._CONFIG.env

  for( var i = -1, n = fields.length; ++i < n; )
  {
    result = result[ fields[ i ] ]

    if( result == 'undefined' && i < n - 1 )
        result = {}

    if( typeof result === 'undefined' )
        return result || defaults
  }

  return result
}

module.exports = Config
