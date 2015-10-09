/**
 * Squid Core
 *
 * Debug cache class, nothing is save
 *
 */

'use strict';

var Logger = function(){}

Logger.prototype.getEngineName = function()
{
  return 'BASIC'
}

Logger.prototype.print = function()
{
  console.log.apply( console, arguments )
}

module.exports = Logger
