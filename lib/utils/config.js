/**
 * Squid Core
 *
 * Manage config across all of your environments
 *
 */

'use strict';

var _ = require('lodash')

// Initialize Config Class
//
//      @params  {object}  custom config properties
//      @return  {object}  Config instance
//
var Config = function( options )
{
  // CORE's settings
  // ------------------------

  this._ENV    = options.env || 'default'
  this._CONFIG = _.merge(
        require( '../config/squid' )
      , require( '../config/' + this._ENV )
    )

  return this
}


// get Config environment
//
//      @return  {string}
//
Config.prototype.targetEnv = function()
{
  return this._ENV
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
    , result = this._CONFIG

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
