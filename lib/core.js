/**
 * Squid Core
 *
 */

'use strict';

var _       = require('lodash')
  , winston = require('winston') // Advanced logging with NodeJs
  , Config  = require('squid-config')
  , Storage = require('./utils/storage')

winston.emitErrs = true

var Squid = function()
{
  // APP'S Constants
  // -------------

  // Current version of the library.
  this._VERSION     = '0.2.0'

  // User credentials localStorage's item name
  this._CREDENTIALS = 'SquidUserCredentials'

  // test instance uniqueness
  this._UID         = _.uniqueId('squid_')

  // APP'S instances
  // -------------

  this._CONFIG      = false
  this._STORAGE     = false
  this._LOGGER      = false

  // APP'S Errors messages
  // -------------

  this._errors = {
      credentialsNotSet: '[Core] User credentials are not set'
    , fileNotFound:      '[Core::getFile] can not find "@@filename.js" in @@directory'
    , missingStorage:    '[Core::getStorage] Storage not set'
    , missingConfig:     '[Core::getConfig] Configuration not set'
    , missingGithub:     '[Core::setup] Missing Github app configuration'
  }

  // return Squid Core reference
  return this
}

// setup app config
//
Squid.prototype.setup = function( options )
{
  options = options || {}

  // save instance configuration
  this._CONFIG  = new Config( 'core', __dirname + '/config/', options.env || 'prod', options.local || {}  )

  // add Github's App credentials
  try
  {
    this._CONFIG.set( 'github.credentials', require( __dirname + '/../github.json') )
  }
  catch( e )
  {
    throw new Error( this._errors.missingGithub )
  }

  // initialize storage engine
  this._STORAGE = new Storage( options.storage )

  // Setup logger
  var transports = []
    , logger     = this._CONFIG.get('logger.transports')

  for( var i in logger )
  {
    if( logger[ i ] )
    {
      var output = logger[ i ].outputTransports
      delete logger[ i ].outputTransports
      transports.push( new winston.transports[ output ]( logger[ i ] ) )
    }
  }

  this._LOGGER = new winston.Logger(
  {
      transports:  transports
    , exitOnError: this._CONFIG.get('logger.exitOnError')
  })

  this._LOGGER.info('[Core] Config/Storage/Logger ready')
  this._LOGGER.info('[Core] version: ' + this._VERSION)
  this._LOGGER.info('[Core] environement: ' + this._CONFIG.getEnv())
  this._LOGGER.info('[Core] storage engine: ' + this._STORAGE.getEngine())

  if( this._CONFIG.get('debug') )
    this._LOGGER.debug('[Core] config: ' + JSON.stringify( this ._CONFIG.get() ) )

  return this
}

// Logger
//-------------------------------

// Logger property alias
//
//      @return  {object}
//
Squid.prototype.logger = function()
{
  return this._LOGGER
}

// Config
//-------------------------------

// Config property alias
//
//      @return  {object}
//
Squid.prototype.config = function()
{
  if( !this._CONFIG )
    throw new Error( this._errors.missingConfig )

  return this._CONFIG
}

// get Config item alias
//
//      @param   {string}   dot notation based key's path
//      @params  {mixed}    default value if not found
//      @return  {mixed}
//
Squid.prototype.getConfig = function( key, defaults )
{
  if( !this._CONFIG )
    throw new Error( this._errors.missingConfig )

  return this._CONFIG.get( key, defaults )
}

// Storage
//-------------------------------

// Storage property alias
//
//      @return  {object}
//
Squid.prototype.storage = function()
{
  if( !this._STORAGE )
    throw new Error( this._errors.missingStorage )

  return this._STORAGE
}

// get a storage value by key name
// throw an Error if key is not found
//
//      @param   {string}   key
//      @return  {mixed}
//
Squid.prototype.getStorage = function( key, defaults )
{
  if( !this._STORAGE )
    throw new Error( this._errors.missingStorage )

  return this._STORAGE.get( key, defaults )
}


// CREDENTIALS / LOGIN
//-------------------------------


// Set user credentials.
//
//      @param   {string}   `Basic Auth` encoded string
//      @return  {void}
//
Squid.prototype.setCredentials = function( credentials )
{
  // console.info('Store user encoded credentials')

  this._STORAGE.set( this._CREDENTIALS, credentials )
}

// Return current user `Basic Auth` encoded credentials
// throw an Error if User credentials are not set
//
//      @return  {object}
//
Squid.prototype.getCredentials = function()
{
  try
  {
    return this._STORAGE.get( this._CREDENTIALS )
  }
  catch( e )
  {
    throw new Error( this._errors.credentialsNotSet )
  }
}

// Check if current user is logged in
//
//      @return  {boolean}
//
Squid.prototype.isLogin = function()
{
  try
  {
    return !!this.getCredentials()
  }
  catch( e )
  {
    return false
  }
}


// Core files request
// -----------------------

Squid.prototype.getFile = function( _directory, _filename )
{
  var _path = __dirname + '/' + _directory + '/'

  try
  {
    return require(  _path + _filename )
  }
  catch( e )
  {
    var messages = this._errors
                    .fileNotFound
                    .replace('@@filename', _filename)
                    .replace('@@directory', _path )

    throw new Error( messages )
  }
}

  // Alias
  // ---------

Squid.prototype.model = function( _model )
{
  return this.getFile( 'models', _model )
}

Squid.prototype.collection = function( _collection )
{
  return this.getFile( 'collection', _collection )
}

Squid.prototype.action = function( _action )
{
  return this.getFile( 'actions', _action )
}

Squid.prototype.store = function( _store )
{
  return this.getFile( 'stores', _store )
}

Squid.prototype.util = function( _file )
{
  return this.getFile( 'utils', _file )
}


// Init
// ----------

module.exports = new Squid()
