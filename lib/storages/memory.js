/**
 * Squid Core
 *
 * Debug cache class, nothing is save
 *
 */

'use strict';

var Memory = function()
{
  this.datas = {}
}

Memory.prototype.get = function( key )
{
  // if( !this.datas[ key ] )
  //   return false

  return this.datas[ key ]
}

Memory.prototype.set = function( key, value )
{
  this.datas[ key ] = value

  return true
}

module.exports = Memory
