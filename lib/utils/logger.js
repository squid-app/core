/**
 * Squid Core
 *
 * Abstraction class for log stategy
 *
 */

'use strict';

// Initialize Logger Class
//
//      @params  {object}  config
//      @return  {object}  Logger instance
//
var Logger = function( options )
{
  this._LOGGER = false

  // No logger
  if( !options )
    return false

  // default options
  options = options || {}

  // Engine instance
  if( typeof options.print === 'function' )
  {
    this._LOGGER   = options
  }
  else
  {
    options.engine = options.engine || require('../abstracts/logger')
    this._LOGGER   = new options.engine( options )
  }

  return this
}

// this._LOGGER allias
//
//      @return  {object} Logger instance
//
Logger.prototype.get = function()
{
  return this._LOGGER
}

module.exports = Logger
