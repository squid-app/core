/**
 * Squid Core
 *
 */

'use strict';

var _              = require('lodash')
  , configManager  = require('./utils/config')
  , storageManager = require('./utils/storage')

var Squid = function()
{
  // APP'S Constants
  // -------------

  // Current version of the library.
  this._VERSION     = '0.1.0'

  // User credentials localStorage's item name
  this._CREDENTIALS = 'SquidUserCredentials'

  // test instance uniqueness
  this._UID         = _.uniqueId('squid_')

  // APP'S Errors messages
  // -------------

  this._errors = {
      credentialsNotSet: '[Core] User credentials are not set'
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
  this._config  = new configManager( options.config || {} )

  // initialize storage engine
  this._storage = new storageManager( options.storage || {} )

  return this
}


// Config
//-------------------------------

// get Config item alias
//
//      @param   {string}   dot notation based key's path
//      @params  {mixed}    default value if not found
//      @return  {mixed}
//
Squid.prototype.getConfig = function( key, defaults )
{
  return this._config.get( key, defaults )
}

// Storage
//-------------------------------

// get a storage value by key name
// throw an Error if key is not found
//
//      @param   {string}   key
//      @return  {mixed}
//
Squid.prototype.getStorage = function( key, defaults )
{
  return this._storage.get( key, defaults )
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

  this._storage.set( this._CREDENTIALS, credentials )
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
    return this._storage.get( this._CREDENTIALS )
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

var getFile = function( _directory, _filename )
{
  try
  {
    return require( __dirname + '/' + _directory + '/' + _filename )
  }
  catch( e )
  {
    throw new Error( '[Core::getFile] can not find "' + _filename + '.js" in ./lib/' + _directory )
  }
}

  // Alias
  // ---------

Squid.prototype.model = function( _model )
{
  return getFile( 'models', _model )
}

Squid.prototype.collection = function( _collection )
{
  return getFile( 'collection', _collection )
}

Squid.prototype.action = function( _action )
{
  return getFile( 'actions', _action )
}

Squid.prototype.store = function( _store )
{
  return getFile( 'stores', _store )
}

Squid.prototype.util = function( _file )
{
  return getFile( 'utils', _file )
}


// Init
// ----------

module.exports = new Squid()
