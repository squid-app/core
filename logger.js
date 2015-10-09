/**
 * Squid Core test file, to be remove
 *
 * Advanced logging with NodeJs
 * http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
 *
 */

'use strict';

var  _      = require('lodash')
  , winston = require('winston')

winston.emitErrs = true

var _LOGNAME = '[Desktop::Utils::Logger] '

// Initialize Logger Class
//
//      @params  {object}  config
//      @return  {object}  Logger instance
//
var Logger = function( options )
{
  this._LOGGER = false

  options = options || false

  // no options, no logger
  // usefull for test env
  if( !options )
    return this

  // Logger require transports options
  if( _.isUndefined( options.transports ) )
    throw new Error( _LOGNAME + 'missing transports options' )

  //initialize logger
  this._LOGGER = new winston.Logger(
  {
      exitOnError: options.exitOnError || false
    , transports:  [
         new winston.transports[ options.output || 'File' ]( options.transports )
      ]
  })
}

Logger.prototype.getEngineName = function()
{
  return 'WINSTON'
}

// Display info level message
//
//      @params  {mixed}  single message or an array of messages
//      @return  {void}
//
Logger.prototype.print = function( message )
{
  // Logger is not setup
  if( !this._LOGGER )
    return

  this._LOGGER.info.apply( this, arguments )
}

module.exports = Logger
