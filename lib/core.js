/**
 * Squid Core
 *
 */

'use strict';

var _             = require('lodash')
  , configManager = require('./utils/config')

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

  // User's session
  // -------------

  // current user's credentials
  this._credentials = false

  // return Squid Core reference
  return this
}

// Config
//-------------------------------


// setup Config
//
Squid.prototype.setConfig = function( options )
{
  options = options || {}

  this._config = new configManager( options.config || {} )

  return this
}

// get Config item alias
//
Squid.prototype.getConfig = function( key, defaults )
{
  return this._config.get( key, defaults )
}


// Core files
// -------------

var getFile = function( _directory, _filename )
{
  try
  {
    return require( './' + _directory+ '/' + _filename )
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
