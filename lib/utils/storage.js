/**
 * Squid Core
 *
 * Abstraction class for data storage stategy
 *
 */

'use strict';

var _LOGNAME = '[Core::Utils::Storage] '

// Initialize Storage Class
//
//      @params  {object}  config
//      @return  {object}  Storage instance
//
var Storage = function( options )
{
  this._STORAGE = false

  // default options
  options = options || {}

  // Engine instance
  if( typeof options.getEngineName === 'function' )
  {
    this._STORAGE  = options
  }
  else
  {
    options.engine = options.engine || require('../abstracts/storage')
    this._STORAGE  = new options.engine( options )
  }

  return this
}

// Get Engine Name
//
//      @return  {string}
//
Storage.prototype.getEngine = function()
{
  return this._STORAGE.getEngineName()
}

// Set data
//
//      @param   {string}  key
//      @param   {mixed}   value
//      @return  {object}  Storage instance
//
Storage.prototype.set = function( key, value )
{
  this._STORAGE.set( key, value )

  return this
}

// Return current user `Basic Auth` encoded credentials
//
//      @return  {object}
//
Storage.prototype.get = function( key )
{
  var value = this._STORAGE.get( key )

  if( typeof value === 'undefined' )
    throw new Error( _LOGNAME + 'Key "' + key + '" not found in storage'  )

  return value
}

// Remove Key
//
//      @param   {string}  key
//      @return  {object}  Storage instance
//
Storage.prototype.remove = function( key )
{
  this._STORAGE.remove( key )

  return this
}

// Storage length
//
//      @return  {int}
//
Storage.prototype.length = function()
{
  return this._STORAGE.length()
}


// Clear Storage
//
//      @return  {object}  Storage instance
//
Storage.prototype.clear = function()
{
  this._STORAGE.clear()

  return this
}

module.exports = Storage
