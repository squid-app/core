/**
 * Squid Core
 *
 * Abstraction class for data storage
 *
 */

'use strict';

var Memory = require('../storages/memory')

// Initialize Storage Class
//
//      @params  {object}  config
//      @return  {object}  Storage instance
//
var Storage = function( options )
{
  options = options || { engine: 'Memory' }

  switch( options.engine )
  {
    // TODO
    case 'localStorage':
      this._engineInstance = new LocalStorage()
      break

    default:
      this._engineInstance = new Memory()
      break
  }

  this._engineName = options.engine

  return this
}

// Get Engine Name
//
//      @return  {string}
//
Storage.prototype.getEngine = function()
{
  return this._engineName
}

// Set data
//
//      @param   {string}  key
//      @param   {mixed}   value
//      @return  {object}  Storage instance
//
Storage.prototype.set = function( key, value )
{
  this._engineInstance.set( key, value )

  return this
}

// Return current user `Basic Auth` encoded credentials
//
//      @return  {object}
//
Storage.prototype.get = function( key )
{
  var value = this._engineInstance.get( key )

  if( typeof value === 'undefined' )
    throw new Error( '[Core::Storage] Key "' + key + '" not found in storage'  )

  return value
}

module.exports = Storage
