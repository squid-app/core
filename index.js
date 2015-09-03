/**
 * Squid Core
 * Squid is a Github issues client on Mac OS X and IOS.
 *
 * @package    Core
 * @version    0.1.0
 * @author     Squid Development Team
 * @license    MIT License
 * @copyright  2015 Squid Development Team
 * @link       http://getsquiddone.com
 */

'use strict';

var SquidCore = require('./lib/core')

// Core App
// -----------

exports.core = function( options )
{
  return new SquidCore( options )
}

// Core files
// -------------

var getFile = function( _directory, _filename )
{
  try
  {
    return require('./lib/' + _directory+ '/' + _filename )
  }
  catch( e )
  {
    throw new Error( '[Core::getFile] can not find "' + _filename + '.js" in ./lib/' + _directory )
  }
}

  // Alias
  // ---------

exports.model = function( _model )
{
  return getFile( 'models', _model )
}

exports.collection = function( _collection )
{
  return getFile( 'collection', _collection )
}

exports.action = function( _action )
{
  return getFile( 'actions', _action )
}

exports.store = function( _store )
{
  return getFile( 'stores', _store )
}

exports.util = function( _file )
{
  return getFile( 'utils', _file )
}
