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

Storage.prototype.remove = function( key )
{
  delete this.datas[ key ]

  return true
}

Storage.prototype.length = function()
{
  return Object.keys( this.datas ).length
}

Storage.prototype.clear = function()
{
  this.datas = {}

  return true
}

module.exports = Storage
