/**
 * Squid Core
 *
 * Debug cache class, nothing is save
 *
 */

'use strict';

var Storage = function()
{
  this.datas = {}
}

Storage.prototype.getEngineName = function()
{
  return 'MEMORY'
}

Storage.prototype.get = function( key )
{
  // if( !this.datas[ key ] )
  //   return false

  return this.datas[ key ]
}

Storage.prototype.set = function( key, value )
{
  this.datas[ key ] = value

  return true
}

module.exports = Storage
