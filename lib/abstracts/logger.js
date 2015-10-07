/**
 * Squid Core
 *
 * Debug cache class, nothing is save
 *
 */

'use strict';

var Logger = function()
{
}

Logger.prototype.print = function()
{
  console.log.apply( this, arguments )
}

module.exports = Logger
