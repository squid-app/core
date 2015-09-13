/**
 * Squid Core
 *
 * Advanced logging with NodeJs
 * http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
 *
 */

'use strict';

var winston = require('winston')
  , _       = require('lodash')

winston.emitErrs = true

// Initialize Logger Class
//
//      @params  {object}  config
//      @params  {bool}    debug mode
//      @return  {object}  Logger instance
//
var Logger = function( options, debug )
{
  this._LOGGER = false
  this._DEBUG  = debug || false
  this._LEVELS = [] // available levels

  options = options || false

  // no options, no logger
  // usefull for test env
  if( !options )
    return this

  // Logger require transports options
  if( _.isUndefined( options.transports ) )
    throw new Error('[Core::Utils::Logger] missing transports options')

  var transports = []
    , logger     = options.transports

  for( var i in logger )
  {
    if( logger[ i ] )
    {
      // store available levels
      if( this._LEVELS.indexOf( logger[ i ].level ) === -1 )
        this._LEVELS.push( logger[ i ].level )

      // get transport output
      var output = logger[ i ].outputTransports

      // remove useless property
      delete logger[ i ].outputTransports

      // create transport
      transports.push( new winston.transports[ output ]( logger[ i ] ) )
    }
  }

  //initialize logger
  this._LOGGER = new winston.Logger(
  {
      transports:  transports
    , exitOnError: options.exitOnError || false
  })

  return this
}

// Return available levels
//
//      @return  {array}
//
Logger.prototype.getLevels = function()
{
  return this._LEVELS
}

// Check if required levels exists
//
//      @params  {string} required level
//      @return  {bool}
//
Logger.prototype.isValidLevel = function( level )
{
  return ( this._LEVELS.indexOf( level ) !== -1 )
}

// Display info level message
//
//      @params  {string} log level, `info` or `debug`
//      @params  {mixed}  single message or an array of messages
//      @return  {void}
//
Logger.prototype.print = function( level, messages )
{
  // Logger is not setup
  if( !this._LOGGER )
    return

  // if we get a single message
  if( !_.isArray( messages ) )
    messages = [ messages ]

  _.forEach(  messages, function( message )
  {
    this._LOGGER[ level ]( message )
  }, this)
}

module.exports = Logger
