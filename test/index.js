/**
 * Squid Core
 *
 * Unit Test
 *
 */

var should      = require('chai').should()
  , pjson       = require('../package.json')          // package.js file
  , cjson       = require('../lib/config/squid.json') // App config file
  , _ENV        = 'test'
  , _INDEX_PATH = '../index'

// Setup an App instance w/ `test` env
var SquidCore = require( _INDEX_PATH ).core({
      config: { env: _ENV }
    })

// Test Core library
describe( '#core', function()
{
  it('Get Squid Core version', function()
  {
    SquidCore
      ._VERSION
      .should
      .equal( pjson.version )
  })

  it('Get Squid Config environment', function()
  {
    SquidCore
      ._config
      .targetEnv()
      .should.equal( 'test' )
  })

  it('Get Squid deep nested config value', function()
  {
    SquidCore
      .getConfig('github.pagination.repositories')
      .should
      .equal( cjson.default.github.pagination.repositories )
  })

  it('Get Squid default Config value', function()
  {
    SquidCore
      .getConfig('fakekey', 'defaultValue')
      .should
      .equal( 'defaultValue' )
  })
})

// Test files manager alias
describe( '#Core/getFile', function()
{
  it('Get utils/xhr file', function()
  {
    var type = ( typeof require( _INDEX_PATH ).util('xhr') )

    type
      .should
      .equal( 'function' )
  })

  it('Catch unknow file error', function()
  {
    (function ()
    {
      new require( _INDEX_PATH ).util('Unknow')
    })
      .should
      .throw( Error )
  })
})


// Test User Model

var userlogin = 'michael-lefebvre'
  , model     = require( _INDEX_PATH ).model('user')
  , user      = new model({ login: userlogin })

describe( '#Models/User', function()
{
  it('Get user login', function()
  {
    user.get('login').should.equal( userlogin )
  })

  it('User do not have name, display login', function()
  {
    user.getName().should.equal( userlogin )
  })

  it('Set user name', function()
  {
    user.set('name', 'michael')
    user.getName().should.equal( 'michael' )
  })
})
