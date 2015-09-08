/**
 * Squid Core
 *
 * Unit Test
 *
 */

var chai            = require('chai')
  , should          = chai.should()
  , expect          = chai.expect
  , assert          = chai.assert
  , pjson           = require('../package.json')     // package.js file
  , cjson           = require('../lib/config/test')  // App test config file
  , _ENV            = 'test'
  , _INDEX_PATH     = '../index'
  , _STORAGE_ENGINE = 'Memory'

// New Squid Core instance
var SquidCore = require( _INDEX_PATH )

// Setup App instance w/ `test` environnement
SquidCore.setup({
    config: { env: _ENV }
  , storage: { engine: _STORAGE_ENGINE }
})

// Test Core library
describe( '#core', function()
{
  it('Core version up-to-date with package.js', function()
  {
    SquidCore
      ._VERSION
      .should
      .equal( pjson.version )
  })

  it('Get Config environment', function()
  {
    SquidCore
      ._config
      .targetEnv()
      .should
      .equal( _ENV )
  })

  it('Get deep nested Config value', function()
  {
    SquidCore
      .getConfig('github.pagination')
      .should
      .equal( cjson.github.pagination )
  })

  it('Get default Config value', function()
  {
    SquidCore
      .getConfig('fakekey', 'defaultValue')
      .should
      .equal( 'defaultValue' )
  })

  it('Get Storage engine name', function()
  {
    SquidCore
      ._storage
      .getEngine()
      .should
      .equal( _STORAGE_ENGINE )
  })

  it('Catch unknow Storage key', function()
  {
    (function ()
    {
      SquidCore.getStorage('test')
    })
      .should
      .throw( Error )
  })

  it('Set and Get Storage value', function()
  {
    SquidCore._storage.set('test', 'ok')

    SquidCore
      .getStorage('test')
      .should
      .equal( 'ok' )
  })

  it('User Credentials not define', function()
  {
    (function ()
    {
      SquidCore.getCredentials()
    })
      .should
      .throw( Error )

    // assert
    //   .throws( SquidCore.getCredentials, Error, SquidCore._errors.credentialsNotSet )
  })

  it('User not logged in', function()
  {
    SquidCore
      .isLogin()
      .should
      .equal( false )
  })

  it('Set User Credentials', function()
  {
    SquidCore.setCredentials('test')

    SquidCore
      .getCredentials()
      .should
      .equal( 'test' )
  })

  it('User is logged in', function()
  {
    SquidCore
      .isLogin()
      .should
      .equal( true )
  })
})

// Test files manager alias
describe( '#Core/getFile', function()
{
  it('Get utils/xhr file', function()
  {
    var type = ( typeof SquidCore.util('xhr') )
console.log(type)
    type
      .should
      .equal( 'function' )
  })

  it('Catch unknow file error', function()
  {
    (function ()
    {
      new SquidCore.util('Unknow')
    })
      .should
      .throw( Error )
  })
})


// Test User Model

var userlogin = 'michael-lefebvre'
  , model     = SquidCore.model('user')
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
