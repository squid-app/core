/**
 * Squid Core
 *
 */

'use strict';

var _       = require('lodash')
  , Config  = require('squid-config')
  , Promise = require('bluebird')
  , Storage = require('./utils/storage')
  , Logger  = require('./utils/logger')

var Squid = function()
{
  // APP'S Constants
  // -------------

  // Current version of the library from package file
  this._VERSION        = require('../package.json').version

  // User token localStorage's item name
  this._GHTOKENKEYNAME = 'SquidUserToken'

  // test instance uniqueness
  this._UID            = _.uniqueId('squid_')

  // APP'S instances
  // -------------

  this._CONFIG      = false
  this._STORAGE     = false
  this._LOGGER      = false

  // APP'S Errors messages
  // -------------

  this._errors = {
      missingToken:   '[Core] missing Github token'
    , missingStorage: '[Core::getStorage] Storage not set'
    , missingConfig:  '[Core::getConfig] Configuration not set'
    , missingGithub:  '[Core::setup] Missing Github app configuration'
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
  this._CONFIG  = new Config( options.config || require('./config/core'), options.locale || {}, options.envName  )

  // Test Github's App credentials
  if( !this._CONFIG.get('github.credentials', false) )
    throw new Error( this._errors.missingGithub )

  // Setup Storage engine and return class instance
  this._STORAGE = new Storage( this._CONFIG.get('storage', false)  )

  // Setup logger engine and return class instance
  this._LOGGER  = new Logger( this._CONFIG.get('logger', false) )

  // remove useless options keys
  this._CONFIG.set( 'storage', false, {unset: true} )
  this._CONFIG.set( 'logger', false, {unset: true} )

  // Display basic logs
  this.logs([
      '[Core] setup:'
    , [ '* version: %s', this._VERSION ]
    , [ '* environement: %s', this._CONFIG.getEnv() ]
    , [ '* storage engine: %s', this._STORAGE.getEngine() ]
    , [ '* logger engine: %s', this._LOGGER.getEngine() ]
    , [ '* config: %s ', JSON.stringify( this ._CONFIG.get() ) ]
  ])

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

// Log a single message
//
//      @params  {mixed}  simple string message or formatted string like `sprintf`
//      @return  {void}
//
Squid.prototype.log = function()
{
  if( !this._LOGGER.get() )
    return

  this._LOGGER.get().print.apply( this._LOGGER.get(), arguments )
}

// Log multiple messages
//
//      @params  {mixed}  array of strings messages/sprintf link array
//      @return  {void}
//
Squid.prototype.logs = function( messages )
{
  if( !this._LOGGER.get() )
    return

  _.forEach(  messages, function( message )
  {
    if( !_.isArray( message ) )
      message = [ message ]

    this._LOGGER.get().print.apply( this._LOGGER.get(), message )
  }, this)
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


// GITHUB TOKEN
//-------------------------------


// Set user token.
//
//      @param   {string}   `authorization` token
//      @return  {void}
//
Squid.prototype.setGithubToken = function( token )
{
  this._STORAGE.set( this._GHTOKENKEYNAME, token )
}

// Return current user token
// throw an Error if token are not set
//
//      @return  {object}
//
Squid.prototype.getGithubToken = function()
{
  try
  {
    return this._STORAGE.get( this._GHTOKENKEYNAME )
  }
  catch( e )
  {
    throw new Error( this._errors.missingToken )  }
}

// PRIVATE: format Github' API applications service
//
//      @param   {string}   `authorization` token
//      @return  {promise}
//
Squid.prototype._callGHApplication = function( token )
{
  var github      = this.service('github')
    , credentials = this.getConfig( 'github.credentials')
    , serviceUrl  = '/applications/' + credentials.client_id + '/tokens/' + token
    , serviceAuth = new Buffer( [ credentials.client_id, credentials.client_secret ].join(':') ).toString('base64')

  return github( serviceUrl, { headers: { 'Authorization': 'Basic ' + serviceAuth }})
}

// Check if current user is logged in
// https://developer.github.com/v3/oauth_authorizations/#check-an-authorization
//
//      @return  {promise}
//
Squid.prototype.isLogged = function()
{
  return Promise
    .try( function()
    {
      // #1 - have we a token?
      return this.getGithubToken()
    }.bind( this ))
    .then( function( token )
    {
      // #2 - Check an authorization
      return this._callGHApplication( token ).get()
    }.bind(this))
}

// Delete local token and revoke Github auth
// https://developer.github.com/v3/oauth_authorizations/#revoke-all-authorizations-for-an-application
//
//      @return  {promise}
//
Squid.prototype.logout = function()
{
  return Promise
    .try( function()
    {
      // #1 - have we a token?
      return this.getGithubToken()
    }.bind( this ))
    .then( function( token )
    {
      // #2 - revoke token from API Auth
      return this._callGHApplication( token ).delete()
    }.bind(this))
}

// Promise loop
// https://gist.github.com/victorquinn/8030190
//
//      @param   {function}  Condition to finish the loop
//      @param   {function}  Action to perform on each loop
//      @param   {array}     Result
//      @return  {promise}
// -----------------------

Squid.prototype.promiseWhile = function( condition, action, results )
{
  var resolver = Promise.defer()

  var loop = function()
  {
    if( !condition() )
      return resolver.resolve( results )

    return Promise
      .cast( action() )
      .then( loop )
      .catch( function( err )
      {
        resolver.reject( err )
      })
  };

  process.nextTick( loop )

  return resolver.promise
}


// Core files request
// -----------------------

Squid.prototype.getFile = function( _directory, _filename )
{
  return require( './' + _directory + '/' + _filename )
}

  // Alias
  // ---------

Squid.prototype.model = function( _model )
{
  return this.getFile( 'models', _model )
}

Squid.prototype.collection = function( _collection )
{
  return this.getFile( 'collections', _collection )
}

Squid.prototype.action = function( _action )
{
  return this.getFile( 'actions', _action )
}

Squid.prototype.store = function( _store )
{
  return this.getFile( 'stores', _store )
}

Squid.prototype.service = function( _file )
{
  return this.getFile( 'services', _file )
}

Squid.prototype.util = function( _file )
{
  return this.getFile( 'utils', _file )
}


// Init
// ----------

module.exports = new Squid()
