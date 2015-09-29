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

// Core App
// -----------
var core = require('./lib/core')

// Current version of the library from package file
core._VERSION = require( __dirname + '/package.json').version

module.exports = core
